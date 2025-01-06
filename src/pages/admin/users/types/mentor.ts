import { ProfilesTable } from "@/integrations/supabase/types/tables/profiles";

export interface MentorPreference {
  team_count: number;
}

export interface MentorTechStack {
  tech_stack_id: string;
  technology_stacks: {
    name: string;
  } | null;
}

export interface MentorData extends ProfilesTable["Row"] {
  mentor_preferences: MentorPreference[];
  mentor_tech_stacks: MentorTechStack[];
  institutions: {
    name: string;
  } | null;
  user_roles: {
    role: "admin" | "mentor" | "participant";
  }[];
}