import { TeamCard } from "../TeamCard";
import { TeamCodeCard } from "../TeamCodeCard";
import { TeamMentorCard } from "../TeamMentorCard";
import { TeamMembersCard } from "../TeamMembersCard";

interface TeamSectionProps {
  team: {
    id: string;
    name: string;
    join_code: string;
    status: string;
    mentor_id: string;
    leader_id: string;
    repository_url: string;
    description: string;
    tech_stack_id: string;
    tech_stack: {
      name: string;
      icon_url: string;
    } | null;
  };
  currentUserId: string;
  onViewTeam: () => void;
  onDeleteTeam: () => void;
  onLockTeam: () => void;
}

export function TeamSection({ 
  team, 
  currentUserId, 
  onViewTeam, 
  onDeleteTeam,
  onLockTeam 
}: TeamSectionProps) {
  const isLeader = team.leader_id === currentUserId;
  const isLocked = team.status === 'locked';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <TeamCard
        team={team}
        onViewTeam={onViewTeam}
        onDeleteTeam={onDeleteTeam}
        isLocked={isLocked}
        currentUserId={currentUserId}
      />
      <TeamCodeCard joinCode={team.join_code} />
      <TeamMentorCard mentorId={team.mentor_id} />
      <TeamMembersCard
        teamId={team.id}
        maxMembers={3}
        isLeader={isLeader}
        isLocked={isLocked}
        onLockTeam={onLockTeam}
      />
    </div>
  );
}