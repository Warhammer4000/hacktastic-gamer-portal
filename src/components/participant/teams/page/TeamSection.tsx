import { TeamCard } from "../TeamCard";
import { TeamDetailsDialog } from "../TeamDetailsDialog";
import { useState } from "react";

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
  onDeleteTeam: () => void;
  onLockTeam: () => void;
}

export function TeamSection({ 
  team, 
  currentUserId, 
  onDeleteTeam,
  onLockTeam 
}: TeamSectionProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isLeader = team.leader_id === currentUserId;
  const isLocked = team.status === 'locked';

  return (
    <>
      <TeamCard
        team={team}
        onEditTeam={() => setIsEditDialogOpen(true)}
        onDeleteTeam={onDeleteTeam}
        isLocked={isLocked}
        currentUserId={currentUserId}
      />

      <TeamDetailsDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        team={team}
      />
    </>
  );
}