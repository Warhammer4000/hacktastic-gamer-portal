export interface MentorWithTeams {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  mentor_tech_stacks: {
    technology_stacks: {
      name: string;
    };
  }[];
  team_count: number;
  max_teams: number;
}