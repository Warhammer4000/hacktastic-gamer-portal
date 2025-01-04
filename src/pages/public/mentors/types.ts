export interface MentorTechStack {
  id: string;
  mentor_id: string;
  tech_stack_id: string;
  technology_stack?: {
    id: string;
    name: string;
    icon_url: string;
  };
}

export interface Mentor {
  id: string;
  full_name: string | null;
  email: string;
  linkedin_profile_id: string | null;
  github_username: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: 'pending_approval' | 'approved' | 'flagged' | 'incomplete';
  tech_stacks?: MentorTechStack[];
}