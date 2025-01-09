import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SessionTemplate, SessionAvailability, SessionBooking } from "../types/booking";
import { format } from "date-fns";

export function useSessionBooking(sessionId: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isError: isSessionError } = useQuery({
    queryKey: ['session-template', sessionId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
      return data as SessionTemplate;
    },
    retry: false
  });

  const { data: availabilities } = useQuery({
    queryKey: ['session-availabilities', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_availabilities')
        .select('*')
        .eq('session_template_id', sessionId);

      if (error) throw error;
      return data as SessionAvailability[];
    },
    enabled: !!session,
  });

  const { data: bookings } = useQuery({
    queryKey: ['session-bookings', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_bookings')
        .select('*')
        .eq('session_template_id', sessionId)
        .eq('status', 'confirmed');

      if (error) throw error;
      return data as SessionBooking[];
    },
    enabled: !!session,
  });

  const bookSlotMutation = useMutation({
    mutationFn: async ({ availabilityId, bookingDate }: { availabilityId: string, bookingDate: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Start a transaction using the REST API
      const { data: booking, error: bookingError } = await supabase
        .from('session_bookings')
        .insert([
          {
            session_template_id: sessionId,
            availability_id: availabilityId,
            booking_date: bookingDate,
            mentor_id: user.id,
            status: 'confirmed'
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Get the availability details for the event timing
      const availability = availabilities?.find(a => a.id === availabilityId);
      if (!availability) throw new Error('Availability not found');

      // Create corresponding event
      const { error: eventError } = await supabase
        .from('events')
        .insert([
          {
            title: session?.name,
            description: session?.description,
            tech_stacks: session?.tech_stack_id ? [session.tech_stack_id] : [],
            roles: ['participant'],
            start_time: `${bookingDate}T${availability.start_time}`,
            end_time: `${bookingDate}T${availability.end_time}`,
            status: 'published',
            created_by: user.id
          }
        ]);

      if (eventError) throw eventError;

      return booking;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Session booked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['session-bookings'] });
      navigate('/mentor/sessions');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to book session. Please try again.",
        variant: "destructive",
      });
      console.error('Booking error:', error);
    },
  });

  return {
    session,
    isSessionError,
    availabilities,
    bookings,
    bookSlotMutation
  };
}