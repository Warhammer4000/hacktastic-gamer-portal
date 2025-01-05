import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: async () => {
      const { data: members, error } = await supabase
        .from('team_members')
        .select(`
          id,
          is_ready,
          user_id,
          profile:profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      return members;
    },
  });
}