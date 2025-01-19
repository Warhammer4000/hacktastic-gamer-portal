import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MentorData } from "../../types/mentor";

export function useMentorList(searchQuery: string, selectedTechStacks: string[]) {
  return useQuery({
    queryKey: ['mentor-users', searchQuery, selectedTechStacks],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (role),
          mentor_preferences!left (
            team_count
          ),
          mentor_tech_stacks!left (
            tech_stack_id,
            technology_stacks (
              name
            )
          ),
          institutions (
            name
          )
        `)
        .eq('user_roles.role', 'mentor');

      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      if (selectedTechStacks.length > 0) {
        const mentorIds = await supabase
          .from('mentor_tech_stacks')
          .select('user_id')
          .in('tech_stack_id', selectedTechStacks);

        if (mentorIds.data) {
          query = query.in('id', mentorIds.data.map(item => item.user_id));
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data as any[]).map(mentor => ({
        ...mentor,
        mentor_preferences: mentor.mentor_preferences || [],
        mentor_tech_stacks: mentor.mentor_tech_stacks || []
      })) as MentorData[];
    },
  });
}