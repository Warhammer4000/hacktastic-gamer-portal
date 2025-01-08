export interface SessionFormValues {
  name: string;
  description: string;
  duration: number;
  tech_stack_id?: string;
  start_date: Date;
  end_date: Date;
  max_slots_per_mentor: number;
  time_slots: Array<{
    day: number;
    startTime: string;
    endTime: string;
  }>;
}

export interface Session extends Omit<SessionFormValues, 'start_date' | 'end_date'> {
  id: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string;
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