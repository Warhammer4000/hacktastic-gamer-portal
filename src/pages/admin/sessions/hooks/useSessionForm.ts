import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  day: number;
  startTime: string;
  endTime: string;
}

interface FormValues {
  name: string;
  description: string;
  duration: number;
  tech_stack_id?: string;
  start_date: Date;
  end_date: Date;
  max_slots_per_mentor: number;
  time_slots: TimeSlot[];
}

export function useSessionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      max_slots_per_mentor: 1,
      start_date: new Date(),
      end_date: new Date(),
      time_slots: [],
    },
  });

  const createSession = useMutation({
    mutationFn: async (values: FormValues) => {
      // First create the session template
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

      // Then create the availability slots
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
        description: "Session template created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create session template: " + error.message,
      });
    },
  });

  return {
    form,
    createSession,
  };
}