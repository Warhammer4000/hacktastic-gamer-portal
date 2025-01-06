import { Database } from "@/integrations/supabase/types";

export interface MentorPreference {
  team_count: number;
}

export interface MentorTechStack {
  tech_stack_id: string;
  technology_stacks: {
    name: string;
  } | null;
}

export interface MentorData extends Database["public"]["Tables"]["profiles"]["Row"] {
  mentor_preferences: MentorPreference[];
  mentor_tech_stacks: MentorTechStack[];
  institutions: {
    name: string;
  } | null;
  user_roles: {
    role: Database["public"]["Enums"]["user_role"];
  }[];
}