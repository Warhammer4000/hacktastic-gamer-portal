import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAvailableParticipants(teamId: string, teamMembers: any[] = []) {
  return useQuery({
    queryKey: ["available-participants", teamId],
    queryFn: async () => {
      // First get all team members to exclude
      const { data: allTeamMembers } = await supabase
        .from("team_members")
        .select("user_id");

      const existingMemberIds = allTeamMembers?.map(m => m.user_id) || [];

      // Then get available participants
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          institution:institutions (
            name
          ),
          user_roles!inner (role)
        `)
        .eq("user_roles.role", "participant")
        .not("id", "in", `(${existingMemberIds.join(",")})`)
        .order("full_name");

      if (error) throw error;
      return data || [];
    },
    enabled: !!teamMembers,
  });
}