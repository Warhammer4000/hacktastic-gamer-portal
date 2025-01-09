import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, isBefore, parseISO, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clock } from "lucide-react";

export default function MentorSessionBookingPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>();

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
    mutationFn: async ({ 
      availabilityId, 
      bookingDate 
    }: { 
      availabilityId: string, 
      bookingDate: string 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Start a transaction by using single requests (Supabase doesn't support true transactions)
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
        // Don't throw here - we still want to keep the booking
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

    // Filter out dates that are before today or after end date
    const dates = [];
    let currentDate = startDate;
    while (!isAfter(currentDate, endDate)) {
      if (!isBefore(currentDate, today)) {
        dates.push(currentDate);
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return dates;
  }, [session, availabilities]);

  // Reset selected date when session changes
  useEffect(() => {
    setSelectedDate(undefined);
  }, [sessionId]);

  if (isSessionError) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Session not found or has been removed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/mentor/sessions')}>
              Back to Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !availabilities) {
    return <div>Loading...</div>;
  }

  const handleBookSlot = (availabilityId: string) => {
    if (!selectedDate) return;
    
    bookSlotMutation.mutate({
      availabilityId,
      bookingDate: format(selectedDate, 'yyyy-MM-dd')
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{session.name}</CardTitle>
              <CardDescription>{session.description}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  {session.duration} minutes per session
                </span>
                {session.technology_stacks && (
                  <Badge variant="outline">{session.technology_stacks.name}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Available Slots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!selectedDate ? (
                <p className="text-sm text-muted-foreground">
                  Select a date to see available slots
                </p>
              ) : (
                availabilities.map((slot) => {
                  const isBooked = bookings?.some(
                    booking =>
                      booking.availability_id === slot.id &&
                      booking.booking_date === format(selectedDate, 'yyyy-MM-dd')
                  );

                  return (
                    <Button
                      key={slot.id}
                      variant="outline"
                      className="w-full justify-start"
                      disabled={isBooked || bookSlotMutation.isPending}
                      onClick={() => handleBookSlot(slot.id)}
                    >
                      {format(parseISO(`2000-01-01T${slot.start_time}`), 'h:mm a')} -{' '}
                      {format(parseISO(`2000-01-01T${slot.end_time}`), 'h:mm a')}
                      {isBooked && <span className="ml-2 text-muted-foreground">(Booked)</span>}
                    </Button>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}