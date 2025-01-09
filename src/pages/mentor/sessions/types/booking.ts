export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  tech_stack_id: string | null;
  start_date: string;
  end_date: string;
  max_slots_per_mentor: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  technology_stacks: {
    id: string;
    name: string;
    icon_url: string;
  };
}

export interface SessionAvailability {
  id: string;
  session_template_id: string;
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
}

export interface SessionBooking {
  id: string;
  session_template_id: string;
  availability_id: string;
  booking_date: string;
  mentor_id: string;
  status: 'confirmed';
}