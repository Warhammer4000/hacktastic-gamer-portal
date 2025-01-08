export interface TimeSlot {
  day: number;
  startTime: string;
  endTime: string;
}

export interface SessionFormValues {
  name: string;
  description: string;
  duration: number;
  tech_stack_id?: string;
  start_date: Date;
  end_date: Date;
  max_slots_per_mentor: number;
  time_slots: TimeSlot[];
}

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
  time_slots?: TimeSlot[];
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