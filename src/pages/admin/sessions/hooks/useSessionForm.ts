import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, SessionFormValues } from "../types/session-form";

export function useSessionForm(sessionToEdit?: Session) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const defaultValues: SessionFormValues = sessionToEdit ? {
    name: sessionToEdit.name,
    description: sessionToEdit.description,
    duration: sessionToEdit.duration,
    tech_stack_id: sessionToEdit.tech_stack_id,
    max_slots_per_mentor: sessionToEdit.max_slots_per_mentor,
    start_date: new Date(sessionToEdit.start_date),
    end_date: new Date(sessionToEdit.end_date),
    time_slots: sessionToEdit.session_availabilities?.map(avail => ({
      day: avail.day_of_week,
      startTime: avail.start_time,
      endTime: avail.end_time
    })) || []
  } : {
    name: "",
    description: "",
    duration: 30,
    max_slots_per_mentor: 1,
    start_date: new Date(),
    end_date: new Date(),
    time_slots: [],
  };

  const form = useForm<SessionFormValues>({
    defaultValues
  });

  const createSession = useMutation({
    mutationFn: async (values: SessionFormValues) => {
      if (sessionToEdit) {
        // Update existing session
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
          .eq('id', sessionToEdit.id);

        if (sessionError) throw sessionError;

        // Delete existing availabilities
        await supabase
          .from("session_availabilities")
          .delete()
          .eq('session_template_id', sessionToEdit.id);
      } else {
        // Create new session
        const { data: sessionTemplate, error: sessionError } = await supabase
          .from("session_templates")
          .insert([
            {
              name: values.name,
              description: values.description,
              duration: values.duration,
              tech_stack_id: values.tech_stack_id,
              start_date: values.start_date.toISOString(),
              end_date: values.end_date.toISOString(),
              max_slots_per_mentor: values.max_slots_per_mentor,
            },
          ])
          .select()
          .single();

        if (sessionError) throw sessionError;

        // Create availabilities for new session
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
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session-templates"] });
      toast({
        title: "Success",
        description: sessionToEdit ? "Session updated successfully" : "Session created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${sessionToEdit ? 'update' : 'create'} session: ${error.message}`,
      });
    },
  });

  return {
    form,
    createSession,
  };
}
