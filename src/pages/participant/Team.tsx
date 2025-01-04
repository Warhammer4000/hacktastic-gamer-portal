import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CreateTeamDialog } from "@/components/participant/teams/CreateTeamDialog";
import { JoinTeamDialog } from "@/components/participant/teams/JoinTeamDialog";
import { TeamCard } from "@/components/participant/teams/TeamCard";
import { TeamCodeCard } from "@/components/participant/teams/TeamCodeCard";
import { TeamMentorCard } from "@/components/participant/teams/TeamMentorCard";
import { TeamDetailsDialog } from "@/components/participant/teams/TeamDetailsDialog";
import { DeleteTeamDialog } from "@/components/participant/teams/DeleteTeamDialog";
import { TeamMembersCard } from "@/components/participant/teams/TeamMembersCard";

const MAX_TEAM_MEMBERS = 3; // New constant for max team members

export default function TeamPage() {
  const [isViewTeamOpen, setIsViewTeamOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: team, isLoading } = useQuery({
    queryKey: ['participant-team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teamMember, error: teamMemberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (teamMemberError || !teamMember) return null;

      const { data: team, error: teamError } = await supabase
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

      if (teamError) return null;
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

      toast.success("Team locked successfully");
      navigate(0);
    } catch (error) {
      console.error('Error locking team:', error);
      toast.error("Failed to lock team");
    }
  };

  if (isLoading) {
    return (
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-8">Team</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="animate-pulse">
            <div className="h-32 bg-muted"></div>
          </Card>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-8">Team</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Create a Team</h2>
              <p className="text-muted-foreground mb-4">
                Start your own team and invite others to join
              </p>
              <CreateTeamDialog maxMembers={MAX_TEAM_MEMBERS} />
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Join a Team</h2>
              <p className="text-muted-foreground mb-4">
                Join an existing team using their team code
              </p>
              <JoinTeamDialog />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Team</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TeamCard
          team={team}
          onViewTeam={() => setIsViewTeamOpen(true)}
          onDeleteTeam={() => setIsDeleteDialogOpen(true)}
          isLocked={team.status === 'locked'}
        />
        <TeamCodeCard joinCode={team.join_code} />
        <TeamMentorCard mentorId={team.mentor_id} />
        <TeamMembersCard
          teamId={team.id}
          maxMembers={MAX_TEAM_MEMBERS}
          isLeader={team.leader_id === currentUser?.id}
          isLocked={team.status === 'locked'}
          onLockTeam={handleLockTeam}
        />
      </div>

      <TeamDetailsDialog
        isOpen={isViewTeamOpen}
        onOpenChange={setIsViewTeamOpen}
        team={{
          id: team.id,
          name: team.name,
          description: team.description,
          status: team.status,
          tech_stack: team.tech_stack,
          tech_stack_id: team.tech_stack_id,
          repository_url: team.repository_url,
          leader_id: team.leader_id,
        }}
      />

      <DeleteTeamDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteTeam}
      />
    </div>
  );
}