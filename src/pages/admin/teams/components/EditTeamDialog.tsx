import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamMemberManagement } from "./edit-team/TeamMemberManagement";
import { TeamBasicInfoFields } from "./edit-team/TeamBasicInfoFields";
import { TeamStatusSection } from "./edit-team/TeamStatusSection";
import { DialogFooter } from "./edit-team/DialogFooter";
import { useTeamData } from "../hooks/useTeamData";
import { useAvailableParticipants } from "../hooks/useAvailableParticipants";
import { teamMutations } from "../services/teamMutations";
import type { TeamStatus } from "./edit-team/types";

interface EditTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated: () => void;
  teamId: string;
}

export function EditTeamDialog({ 
  isOpen, 
  onClose, 
  onTeamUpdated, 
  teamId 
}: EditTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { data: team, isLoading: isLoadingTeam } = useTeamData(teamId);
  const { data: participants = [], isLoading: isLoadingParticipants } = useAvailableParticipants(
    teamId,
    team?.team_members
  );

  if (!team || isLoadingTeam) {
    return null;
  }

  const handleBasicInfoUpdate = async (data: { 
    name: string; 
    description: string; 
    tech_stack_id: string | null 
  }) => {
    await teamMutations.updateBasicInfo(teamId, data, queryClient);
  };

  const handleStatusChange = async (newStatus: TeamStatus) => {
    await teamMutations.updateTeamStatus(teamId, newStatus, queryClient);
  };

  const handleLeaderChange = async (newLeaderId: string) => {
    await teamMutations.updateTeamLeader(teamId, newLeaderId, queryClient);
  };

  const handleMemberAdd = async (memberId: string) => {
    await teamMutations.addTeamMember(teamId, memberId, queryClient);
  };

  const handleMemberRemove = async (memberId: string) => {
    await teamMutations.removeTeamMember(teamId, memberId, queryClient);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <TeamBasicInfoFields
            name={team.name}
            description={team.description || ""}
            techStackId={team.tech_stack_id}
            onUpdate={handleBasicInfoUpdate}
          />

          <TeamMemberManagement
            teamMembers={team.team_members}
            availableParticipants={participants}
            leaderId={team.leader_id}
            onMemberAdd={handleMemberAdd}
            onMemberRemove={handleMemberRemove}
            onLeaderChange={handleLeaderChange}
            maxMembers={team.max_members}
            isLocked={team.status === "locked"}
          />

          <TeamStatusSection
            status={team.status as TeamStatus}
            onStatusChange={handleStatusChange}
          />

          <DialogFooter
            onClose={onClose}
            onSave={onTeamUpdated}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}