import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenteeTeamCard } from "@/components/mentor/mentees/MenteeTeamCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenteesPage() {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['mentor-teams'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          description,
          status,
          repository_url,
          leader_id,
          tech_stack:tech_stack_id (
            name,
            icon_url
          ),
          team_members (
            id,
            is_ready,
            profile:profiles (
              id,
              full_name,
              email,
              avatar_url,
              github_username,
              linkedin_profile_id,
              institution:institutions (
                name
              )
            )
          )
        `)
        .eq('mentor_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      return teams;
    },
  });

  if (isLoading) {
    return (
      <div className="container p-6 space-y-6">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">My Teams</h1>
      <div className="space-y-6">
        {teams?.map((team) => (
          <MenteeTeamCard key={team.id} team={team} />
        ))}
        {teams?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven't been assigned to any teams yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}