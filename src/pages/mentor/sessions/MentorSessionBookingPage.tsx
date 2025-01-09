import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MentorSessionBookingPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Fetch session details
  const { data: session } = useQuery({
    queryKey: ['session-details', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_templates')
        .select(`
          *,
          technology_stacks (*),
          session_availabilities (*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch existing bookings for this session
  const { data: existingBookings } = useQuery({
    queryKey: ['session-bookings', sessionId, selectedDate?.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_bookings')
        .select('*')
        .eq('session_template_id', sessionId)
        .eq('status', 'confirmed');

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId,
  });

  // Mutation for booking a slot
  const bookSlotMutation = useMutation({
    mutationFn: async ({ 
      availabilityId, 
      bookingDate 
    }: { 
      availabilityId: string, 
      bookingDate: string 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('session_bookings')
        .insert({
          session_template_id: sessionId,
          mentor_id: user.id,
          availability_id: availabilityId,
          booking_date: bookingDate,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Session booked successfully!");
      queryClient.invalidateQueries({ queryKey: ['session-bookings'] });
      navigate('/mentor/sessions');
    },
    onError: (error) => {
      toast.error("Failed to book session: " + error.message);
    }
  });

  const availableTimeSlots = session?.session_availabilities?.filter(slot => {
    if (!selectedDate) return false;
    
    // Check if the slot is for the selected day of week
    const dayOfWeek = selectedDate.getDay();
    if (slot.day_of_week !== dayOfWeek) return false;

    // Check if this slot is already booked for this date
    const isBooked = existingBookings?.some(
      booking => 
        booking.availability_id === slot.id && 
        booking.booking_date === selectedDate.toISOString().split('T')[0]
    );

    return !isBooked;
  }) || [];

  const handleBookSlot = async (slotId: string) => {
    if (!selectedDate) return;

    bookSlotMutation.mutate({
      availabilityId: slotId,
      bookingDate: selectedDate.toISOString().split('T')[0]
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{session?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                // Disable dates outside the session range
                return (
                  date < new Date(session?.start_date || '') ||
                  date > new Date(session?.end_date || '') ||
                  // Disable dates that don't have any available slots
                  !session?.session_availabilities?.some(
                    slot => slot.day_of_week === date.getDay()
                  )
                );
              }}
            />
          </CardContent>
        </Card>

        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableTimeSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleBookSlot(slot.id)}
                  disabled={bookSlotMutation.isPending}
                >
                  {format(new Date(`2000-01-01T${slot.start_time}`), 'h:mm a')} - 
                  {format(new Date(`2000-01-01T${slot.end_time}`), 'h:mm a')}
                </Button>
              ))}
              {availableTimeSlots.length === 0 && (
                <p className="text-muted-foreground text-center">
                  No available time slots for this date
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}