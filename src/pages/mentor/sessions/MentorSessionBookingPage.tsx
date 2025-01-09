import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MentorSessionBookingPage() {
  const { sessionId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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

  const { data: bookedSlots } = useQuery({
    queryKey: ['booked-slots', sessionId],
    queryFn: async () => {
      // Here you would fetch already booked slots from your bookings table
      // This is a placeholder - implement according to your booking system
      return [];
    },
  });

  const availableTimeSlots = session?.session_availabilities?.filter(slot => {
    if (!selectedDate) return false;
    
    // Check if the slot is for the selected day of week
    const dayOfWeek = selectedDate.getDay();
    return slot.day_of_week === dayOfWeek;
  }) || [];

  const handleBookSlot = async (slotId: string) => {
    // Here you would implement the booking logic
    // This is a placeholder - implement according to your booking system
    toast.success("Session booked successfully!");
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