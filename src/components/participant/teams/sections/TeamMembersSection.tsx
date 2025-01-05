import { useTeamMembers } from "../hooks/useTeamMembers";
import { TeamMemberItem } from "../members/TeamMemberItem";
import { EmptyMemberSlot } from "../members/EmptyMemberSlot";
import { TeamMemberActions } from "../members/TeamMemberActions";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useTeamMemberActions } from "../hooks/useTeamMemberActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Lock } from "lucide-react";

interface TeamMembersSectionProps {
  teamId: string;
  isLeader: boolean;
  isLocked: boolean;
  onLockTeam: () => void;
}

export function TeamMembersSection({
  teamId,
  isLeader,
  isLocked,
  onLockTeam
}: TeamMembersSectionProps) {
  const { data: members, isLoading } = useTeamMembers(teamId);
  const { data: currentUser } = useCurrentUser();
  const { handleReadyToggle, handleLeaveTeam } = useTeamMemberActions(teamId, currentUser?.id);

  const { data: team } = useQuery({
    queryKey: ['team-details', teamId],
    queryFn: async () => {
      const { data: team, error } = await supabase
        .from('teams')
        .select('leader_id, max_members')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      return team;
    },
  });

  const maxMembers = team?.max_members || 3;
  const emptySlots = maxMembers - (members?.length || 0);
  const nonLeaderMembers = members?.filter(member => member.user_id !== team?.leader_id) || [];
  const nonLeaderReadyCount = nonLeaderMembers.filter(member => member.is_ready).length;
  const allNonLeaderMembersReady = nonLeaderReadyCount === nonLeaderMembers.length && nonLeaderMembers.length >= 2;
  const currentUserMember = members?.find(member => member.user_id === currentUser?.id);
  const showLockButton = isLeader && !isLocked && allNonLeaderMembersReady && members && members.length >= 2;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-muted rounded"></div>
        <div className="h-12 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Users className="h-5 w-5" />
        Team Members
      </div>
      
      <div className="space-y-2">
        {members?.map((member) => (
          <TeamMemberItem
            key={member.id}
            userId={member.user_id}
            fullName={member.profile?.full_name}
            isLeader={member.user_id === team?.leader_id}
            isReady={member.is_ready}
            teamId={teamId}
            showRemoveButton={isLeader && !isLocked}
          />
        ))}

        {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, index) => (
          <EmptyMemberSlot key={`empty-${index}`} />
        ))}
      </div>

      <TeamMemberActions
        isLocked={isLocked}
        isLeader={isLeader}
        isReady={currentUserMember?.is_ready || false}
        showLockButton={showLockButton}
        onReadyToggle={handleReadyToggle}
        onLeaveTeam={handleLeaveTeam}
        onLockTeam={onLockTeam}
        isUpdating={false}
      />
    </div>
  );
}