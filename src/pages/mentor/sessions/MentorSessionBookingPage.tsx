import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, isBefore, parseISO, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SessionHeader } from "./components/SessionHeader";
import { TimeSlotSelector } from "./components/TimeSlotSelector";
import { BookingConfirmationDialog } from "./components/BookingConfirmationDialog";

export default function MentorSessionBookingPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlotId, setSelectedSlotId] = useState<string>();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Query for session details
  const { data: session, isError: isSessionError } = useQuery({
    queryKey: ['session-template', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_templates')
        .select(`
          *,
          technology_stacks (*)
        `)
        .eq('id', sessionId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Session not found');
      return data;
    },
  });

  // Query for session availabilities
  const { data: availabilities } = useQuery({
    queryKey: ['session-availabilities', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_availabilities')
        .select('*')
        .eq('session_template_id', sessionId);

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  // Query for existing bookings
  const { data: bookings } = useQuery({
    queryKey: ['session-bookings', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_bookings')
        .select('*')
        .eq('session_template_id', sessionId)
        .eq('status', 'confirmed');

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  // Mutation for booking a slot
  const bookSlotMutation = useMutation({
    mutationFn: async ({ availabilityId, bookingDate }: { availabilityId: string, bookingDate: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Start a transaction by using single requests
      // 1. Create the booking
      const { data: booking, error: bookingError } = await supabase
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

      if (bookingError) {
        console.error('Booking error:', bookingError);
        throw new Error('Failed to create booking');
      }

      // 2. Create the corresponding event
      const slot = availabilities?.find(s => s.id === availabilityId);
      if (!slot) throw new Error('Invalid slot');

      const startTime = new Date(`${bookingDate}T${slot.start_time}`);
      const endTime = new Date(`${bookingDate}T${slot.end_time}`);

      const { error: eventError } = await supabase
        .from('events')
        .insert({
          title: `${session?.name} Session`,
          description: session?.description,
          tech_stacks: session?.tech_stack_id ? [session.tech_stack_id] : [],
          roles: ['mentor'],
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'published',
          created_by: user.id
        });

      if (eventError) {
        console.error('Event creation error:', eventError);
        throw new Error('Failed to create event');
      }

      return booking;
    },
    onSuccess: () => {
      toast({
        title: "Session booked successfully!",
        description: "An event has been created in your calendar.",
      });
      queryClient.invalidateQueries({ queryKey: ['session-bookings'] });
      navigate('/mentor/sessions');
    },
    onError: (error) => {
      console.error('Booking error:', error);
      toast({
        title: "Failed to book session",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Calculate available dates based on session template and existing bookings
  const availableDates = useMemo(() => {
    if (!session || !availabilities) return [];

    const startDate = parseISO(session.start_date);
    const endDate = parseISO(session.end_date);
    const today = startOfToday();

    // Get unique days of the week that have availabilities
    const availableDays = new Set(availabilities.map(a => a.day_of_week));

    // Filter dates that have availabilities
    const dates = [];
    let currentDate = startDate;
    while (!isAfter(currentDate, endDate)) {
      if (!isBefore(currentDate, today) && availableDays.has(currentDate.getDay())) {
        dates.push(currentDate);
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return dates;
  }, [session, availabilities]);

  // Get available slots for selected date
  const availableSlotsForDate = useMemo(() => {
    if (!selectedDate || !availabilities) return [];
    return availabilities.filter(slot => slot.day_of_week === selectedDate.getDay());
  }, [selectedDate, availabilities]);

  const isSlotBooked = (slotId: string) => {
    if (!selectedDate || !bookings) return false;
    return bookings.some(
      booking =>
        booking.availability_id === slotId &&
        booking.booking_date === format(selectedDate, 'yyyy-MM-dd')
    );
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setShowConfirmation(true);
  };

  const handleBookingConfirm = () => {
    if (!selectedDate || !selectedSlotId) return;
    
    bookSlotMutation.mutate({
      availabilityId: selectedSlotId,
      bookingDate: format(selectedDate, 'yyyy-MM-dd')
    });
  };

  // Reset selected date when session changes
  useEffect(() => {
    setSelectedDate(undefined);
    setSelectedSlotId(undefined);
    setShowConfirmation(false);
  }, [sessionId]);

  if (isSessionError) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent>
            <p>Session not found or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !availabilities) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <SessionHeader session={session} />
          <Card className="mt-6">
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => !availableDates.some(d => 
                  d.getFullYear() === date.getFullYear() &&
                  d.getMonth() === date.getMonth() &&
                  d.getDate() === date.getDate()
                )}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-[300px]">
          <TimeSlotSelector
            availableSlots={availableSlotsForDate}
            selectedDate={selectedDate}
            isSlotBooked={isSlotBooked}
            onSelectSlot={handleSlotSelect}
            isPending={bookSlotMutation.isPending}
          />
        </div>
      </div>

      <BookingConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleBookingConfirm}
        selectedDate={selectedDate}
        selectedSlot={availabilities.find(s => s.id === selectedSlotId)}
        isPending={bookSlotMutation.isPending}
      />
    </div>
  );
}