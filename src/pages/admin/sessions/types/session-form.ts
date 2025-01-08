import { z } from "zod";

export interface TimeSlot {
  day: number;
  startTime: string;
  endTime: string;
}

export const sessionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  tech_stack_id: z.string().optional(),
  max_slots_per_mentor: z.number().min(1, "Must allow at least 1 slot per mentor"),
  start_date: z.date(),
  end_date: z.date(),
  time_slots: z.array(z.object({
    day: z.number(),
    startTime: z.string(),
    endTime: z.string()
  }))
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
    start_time: string;
    end_time: string;
  }>;
}