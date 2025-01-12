import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTeamData(teamId: string) {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (
            id,
            user_id,
            profile:profiles (
              id,
              full_name,
              email
            )
          )
        `)
        .eq("id", teamId)
        .single();
      if (error) throw error;
      return data;
    },
  });
}