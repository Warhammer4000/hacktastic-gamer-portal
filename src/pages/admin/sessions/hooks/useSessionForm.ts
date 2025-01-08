import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, SessionFormValues, sessionFormSchema } from "../types/session-form";

export function useSessionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      max_slots_per_mentor: 1,
      start_date: new Date(),
      end_date: new Date(),
      time_slots: [],
    }
  });

  const createSession = useMutation({
    mutationFn: async (values: SessionFormValues) => {
      console.log('Creating session with values:', values);
      // First create session template and wait for the response
      const { data: sessionTemplate, error: sessionError } = await supabase
        .from("session_templates")
        .insert([{
          name: values.name,
          description: values.description,
          duration: values.duration,
          tech_stack_id: values.tech_stack_id,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
          max_slots_per_mentor: values.max_slots_per_mentor,
        }])
        .select()
        .single();

      if (sessionError) throw sessionError;
      if (!sessionTemplate) throw new Error("Failed to create session template");

      console.log('Created session template:', sessionTemplate);

      // Then create availabilities using the session template id
      const availabilityPromises = values.time_slots.map(slot =>
        supabase
          .from("session_availabilities")
          .insert({
            session_template_id: sessionTemplate.id,
            day_of_week: slot.day,
            start_time: slot.startTime,
            end_time: slot.endTime,
          })
      );

      await Promise.all(availabilityPromises);
      return sessionTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-templates"] });
      toast({
        title: "Success",
        description: "Session created successfully",
      });
      form.reset();
    },
  });

  const updateSession = useMutation({
    mutationFn: async ({ id, ...values }: SessionFormValues & { id: string }) => {
      console.log('Updating session with id:', id);
      console.log('Update values:', values);
      
      // First update session template
      const { error: sessionError } = await supabase
        .from("session_templates")
        .update({
          name: values.name,
          description: values.description,
          duration: values.duration,
          tech_stack_id: values.tech_stack_id,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
          max_slots_per_mentor: values.max_slots_per_mentor,
        })
        .eq('id', id);

      if (sessionError) throw sessionError;

      // Delete existing availabilities
      const { error: deleteError } = await supabase
        .from("session_availabilities")
        .delete()
        .eq('session_template_id', id);

      if (deleteError) throw deleteError;

      console.log('Creating new availabilities for session:', id);
      // Create new availabilities
      const availabilityPromises = values.time_slots.map(slot =>
        supabase
          .from("session_availabilities")
          .insert({
            session_template_id: id,
            day_of_week: slot.day,
            start_time: slot.startTime,
            end_time: slot.endTime,
          })
      );

      await Promise.all(availabilityPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-templates"] });
      toast({
        title: "Success",
        description: "Session updated successfully",
      });
    },
  });

  return {
    form,
    createSession,
    updateSession,
  };
}