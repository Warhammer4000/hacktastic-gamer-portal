import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./BasicInfoFields";
import { DurationFields } from "./DurationFields";
import { TechStackField } from "./TechStackField";
import { DateFields } from "./DateFields";
import { TimeSlotField } from "./TimeSlotField";
import { useSessionForm } from "../../hooks/useSessionForm";
import { Session } from "../../types/session-form";

interface SessionFormProps {
  sessionToEdit?: Session;
  onComplete?: () => void;
}

export function SessionForm({ sessionToEdit, onComplete }: SessionFormProps) {
  const { form, createSession, updateSession } = useSessionForm(sessionToEdit);

  const onSubmit = form.handleSubmit((values) => {
    if (sessionToEdit) {
      updateSession.mutate({ id: sessionToEdit.id, ...values });
    } else {
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