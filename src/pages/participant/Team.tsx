import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TeamDetailsDialog } from "@/components/participant/teams/TeamDetailsDialog";
import { DeleteTeamDialog } from "@/components/participant/teams/DeleteTeamDialog";
import { CreateTeamSection } from "@/components/participant/teams/page/CreateTeamSection";
import { TeamSection } from "@/components/participant/teams/page/TeamSection";

const MAX_TEAM_MEMBERS = 3;

export default function TeamPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleDeleteTeam = async () => {
    if (!team) return;

    if (team.status === 'locked') {
      toast.error("Cannot delete a locked team");
      return;
    }

    try {
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id);

      if (membersError) throw membersError;

      const { error: teamError } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);

      if (teamError) throw teamError;

      toast.success("Team deleted successfully");
      navigate(0);
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error("Failed to delete team");
    }
  };

  const handleLockTeam = async () => {
    if (!team) return;
    
    try {
      const { error } = await supabase
        .from('teams')
        .update({ status: 'locked' })
        .eq('id', team.id);

      if (error) throw error;
      
      toast.success("Team has been locked successfully");
      navigate(0);
    } catch (error) {
      console.error('Error locking team:', error);
      toast.error("Failed to lock team");
    }
  };

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Team</h1>
      
      {!team ? (
        <CreateTeamSection maxMembers={MAX_TEAM_MEMBERS} />
      ) : (
        <TeamSection
          team={team}
          currentUserId={currentUser?.id || ''}
          onDeleteTeam={() => setIsDeleteDialogOpen(true)}
          onLockTeam={handleLockTeam}
        />
      )}

      <DeleteTeamDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteTeam}
      />
    </div>
  );
}