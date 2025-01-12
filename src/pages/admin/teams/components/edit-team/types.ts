export type TeamStatus = "draft" | "open" | "locked" | "active" | "pending_mentor";

export interface TeamMember {
  id: string;
  user_id: string;
  profile: {
    full_name: string | null;
    email: string;
  };
}

export interface TeamFormData {
  name: string;
  description: string;
  techStackId: string | null;
  leaderId: string;
}