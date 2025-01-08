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

export interface Session extends SessionFormValues {
  id: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}