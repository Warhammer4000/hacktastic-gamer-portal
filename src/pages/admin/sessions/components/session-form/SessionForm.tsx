import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./BasicInfoFields";
import { DurationFields } from "./DurationFields";
import { TechStackField } from "./TechStackField";
import { DateFields } from "./DateFields";
import { TimeSlotField } from "./TimeSlotField";
import { useSessionForm } from "../../hooks/useSessionForm";
import { Session } from "../../types/session-form";
import { useEffect } from "react";

interface SessionFormProps {
  sessionToEdit?: Session;
  onComplete?: () => void;
}

export function SessionForm({ sessionToEdit, onComplete }: SessionFormProps) {
  const { form, createSession, updateSession } = useSessionForm();

  useEffect(() => {
    if (sessionToEdit) {
      console.log('Setting form values for editing:', sessionToEdit);
      
      // Convert ISO date strings to Date objects
      const startDate = new Date(sessionToEdit.start_date);
      const endDate = new Date(sessionToEdit.end_date);

      // Map session availabilities to time slots format
      const timeSlots = sessionToEdit.session_availabilities?.map(avail => ({
        day: avail.day_of_week,
        startTime: avail.start_time,
        endTime: avail.end_time
      })) || [];

      form.reset({
        name: sessionToEdit.name,
        description: sessionToEdit.description,
        duration: sessionToEdit.duration,
        tech_stack_id: sessionToEdit.tech_stack_id,
        max_slots_per_mentor: sessionToEdit.max_slots_per_mentor,
        start_date: startDate,
        end_date: endDate,
        time_slots: timeSlots
      });

      // Log the reset values for debugging
      console.log('Form reset with values:', {
        name: sessionToEdit.name,
        description: sessionToEdit.description,
        duration: sessionToEdit.duration,
        tech_stack_id: sessionToEdit.tech_stack_id,
        max_slots_per_mentor: sessionToEdit.max_slots_per_mentor,
        start_date: startDate,
        end_date: endDate,
        time_slots: timeSlots
      });
    }
  }, [sessionToEdit, form]);

  const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted with values:', values);
    if (sessionToEdit) {
      console.log('Updating session:', sessionToEdit.id);
      updateSession.mutate({ id: sessionToEdit.id, ...values });
    } else {
      console.log('Creating new session');
      createSession.mutate(values);
    }
    onComplete?.();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {sessionToEdit ? "Edit Session Template" : "Create Session Template"}
        </h1>
        <p className="text-muted-foreground">
          {sessionToEdit ? "Update an existing session template" : "Set up a new mentoring session template"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <BasicInfoFields form={form} />
          <DurationFields form={form} />
          <TechStackField form={form} />
          <DateFields form={form} />
          <TimeSlotField form={form} />

          <Button type="submit" className="w-full">
            {sessionToEdit ? "Update Session Template" : "Create Session Template"}
          </Button>
        </form>
      </Form>
    </div>
  );
}