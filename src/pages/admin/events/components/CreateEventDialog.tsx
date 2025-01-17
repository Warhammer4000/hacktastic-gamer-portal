import { useState, useRef } from "react";
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
import { eventFormSchema, EventFormValues, EventRole } from "../types/event-form";
import { useQueryClient } from "@tanstack/react-query";
import { Import } from "lucide-react";
import { parseICSFile } from "../utils/ics-parser";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setIsSubmitting(true);
      
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

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedEvent = parseICSFile(content);
        
        form.setValue("title", parsedEvent.title);
        form.setValue("description", parsedEvent.description);
        form.setValue("start_time", parsedEvent.start_time);
        form.setValue("end_time", parsedEvent.end_time);

        toast({
          title: "ICS file imported",
          description: "Event details have been filled from the imported file.",
        });
      } catch (error) {
        console.error("Error parsing ICS file:", error);
        toast({
          title: "Error",
          description: "Failed to parse ICS file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create Event</DialogTitle>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".ics"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileImport}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Import className="h-4 w-4 mr-2" />
                Import ICS
              </Button>
            </div>
          </div>
          <DialogDescription>
            Create a new event for mentors and participants.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EventFormFields form={form} />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}