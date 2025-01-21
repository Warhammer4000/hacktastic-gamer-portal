import type { ProfilesTable } from "@/integrations/supabase/types/tables/profiles";

export interface MentorPreference {
  team_count: number;
}

export interface MentorTechStack {
  tech_stack_id: string;
  technology_stacks: {
    name: string;
  } | null;
}

export type MentorData = ProfilesTable["Row"] & {
  mentor_preferences: MentorPreference | null;
  mentor_tech_stacks: MentorTechStack[] | null;
  institutions: {
    name: string;
  } | null;
  user_roles: {
    role: "admin" | "mentor" | "participant";
  }[];
}

export interface MentorFiltersProps {
  selectedTechStacks: string[];
  onTechStackChange: (techStackId: string, pressed: boolean) => void;
}