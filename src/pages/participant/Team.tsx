import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamDetailsDialog } from "@/components/participant/teams/TeamDetailsDialog";
import { DeleteTeamDialog } from "@/components/participant/teams/DeleteTeamDialog";
import { TeamTransition } from "@/components/participant/teams/components/TeamTransition";
import { useTeamTransitionAnimation } from "@/components/participant/teams/hooks/useTeamTransitionAnimation";

export default function TeamPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { isTransitioning: isJoining, handleTransition } = useTeamTransitionAnimation();

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: team } = useQuery({
    queryKey: ['participant-team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!teamMember) return null;

      const { data: team } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          join_code,
          status,
          mentor_id,
          leader_id,
          repository_url,
          description,
          tech_stack_id,
          tech_stack:tech_stack_id (
            name,
            icon_url
          )
        `)
        .eq('id', teamMember.team_id)
        .single();

      return team;
    },
  });

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Team</h1>
      
      <TeamTransition
        team={team}
        isJoining={isJoining}
        currentUserId={currentUser?.id || ''}
        onEditTeam={() => setIsEditDialogOpen(true)}
        onDeleteTeam={() => setIsDeleteDialogOpen(true)}
        onTeamJoined={handleTransition}
      />

      <TeamDetailsDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        team={team}
      />

      <DeleteTeamDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleTransition}
      />
    </div>
  );
}