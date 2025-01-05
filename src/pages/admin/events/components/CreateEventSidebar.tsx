import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventFormFields } from "./event-form/EventFormFields";
import { eventFormSchema, EventFormValues, EventRole } from "../types/event-form";
import { useQueryClient } from "@tanstack/react-query";
import { ICSImport } from "./event-form/ICSImport";

export function CreateEventSidebar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tech_stacks: [],
      roles: [],
      isPublic: false,
      start_time: "",
      end_time: "",
    },
  });

  async function onSubmit(data: EventFormValues) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const roles: EventRole[] = [...data.roles];
      if (data.isPublic) {
        roles.push("public" as EventRole);
      }

      const { error } = await supabase.from("events").insert({
        title: data.title,
        description: data.description,
        tech_stacks: data.tech_stacks,
        roles: roles,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
        status: "draft",
        created_by: user.id,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleICSImport = (eventData: any) => {
    form.setValue("title", eventData.title);
    form.setValue("description", eventData.description);
    form.setValue("start_time", eventData.start_time);
    form.setValue("end_time", eventData.end_time);
  };

  return (
    <div className="w-[40%] border-l p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Create Event</h2>
        <p className="text-sm text-muted-foreground">Add a new event to the calendar.</p>
      </div>
      <ICSImport onImport={handleICSImport} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <EventFormFields form={form} />
          <button
            type="submit"
            className="w-full btn-primary"
          >
            Create Event
          </button>
        </form>
      </Form>
    </div>
  );
}