import { z } from "zod";

export type EventRole = "mentor" | "participant";

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tech_stacks: z.array(z.string()).min(1, "Select at least one technology stack"),
  roles: z.array(z.enum(["mentor", "participant"])).min(1, "Select at least one role"),
  isPublic: z.boolean().default(false),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const roleOptions: { value: EventRole; label: string }[] = [
  { value: "mentor", label: "Mentors" },
  { value: "participant", label: "Participants" },
];