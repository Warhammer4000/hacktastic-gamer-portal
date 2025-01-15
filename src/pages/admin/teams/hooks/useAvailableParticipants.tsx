import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAvailableParticipants(teamId: string, teamMembers: any[] = []) {
  return useQuery({
    queryKey: ["available-participants", teamId],
    queryFn: async () => {
      if (!teamMembers) return [];
      
      const memberIds = teamMembers.map(m => m.user_id);
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          user_roles!inner (role)
        `)
        .eq("user_roles.role", "participant")
        .not("id", "in", `(${memberIds.join(",")})`)
        .order("full_name");

      if (error) throw error;
      return data || [];
    },
    enabled: !!teamMembers,
  });
}