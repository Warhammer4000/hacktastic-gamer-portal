import { z } from "zod";

export interface TimeSlot {
  day: number;
  startTime: string | null;
  endTime: string | null;
}

export const timeSlotSchema = z.object({
  day: z.number(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable()
});

export const sessionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  tech_stack_id: z.string().optional(),
  max_slots_per_mentor: z.coerce.number().min(1, "Must allow at least 1 slot per mentor"),
  start_date: z.date(),
  end_date: z.date(),
  time_slots: z.array(timeSlotSchema).min(1, "At least one time slot is required")
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;

export interface Session {
  id: string;
  name: string;
  description: string;
  duration: number;
  tech_stack_id?: string;
  start_date: string;
  end_date: string;
  max_slots_per_mentor: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  technology_stacks?: {
    id: string;
    name: string;
    icon_url: string;
  };
  session_availabilities?: Array<{
    id: string;
    day_of_week: number;
    start_time: string | null;
    end_time: string | null;
  }>;
}
