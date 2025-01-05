import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventFormFields } from "./event-form/EventFormFields";
import { eventFormSchema, EventFormValues } from "../types/event-form";
import { useQueryClient } from "@tanstack/react-query";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any; // We'll type this properly in a future iteration
}

export function EditEventDialog({ open, onOpenChange, event }: EditEventDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      tech_stacks: event.tech_stacks,
      roles: event.roles.filter((role: string) => role !== "public"),
      isPublic: event.roles.includes("public"),
      start_time: event.start_time,
      end_time: event.end_time,
    },
  });

  async function onSubmit(data: EventFormValues) {
    try {
      setIsSubmitting(true);
      
      const roles = [...data.roles];
      if (data.isPublic) {
        roles.push("public");
      }

      const { error } = await supabase
        .from("events")
        .update({
          title: data.title,
          description: data.description,
          tech_stacks: data.tech_stacks,
          roles: roles,
          start_time: new Date(data.start_time).toISOString(),
          end_time: new Date(data.end_time).toISOString(),
        })
        .eq("id", event.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the event details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EventFormFields form={form} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}