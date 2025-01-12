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
import { TeamMentorSection } from "./edit-team/TeamMentorSection";
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
      <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <TeamBasicInfoFields
                name={team.name}
                description={team.description || ""}
                techStackId={team.tech_stack_id}
                onUpdate={handleBasicInfoUpdate}
              />
              
              <TeamStatusSection
                status={team.status as TeamStatus}
                onStatusChange={handleStatusChange}
              />

              <TeamMentorSection
                teamId={teamId}
                mentorId={team.mentor_id}
                teamName={team.name}
                onMentorUpdated={onTeamUpdated}
              />
            </div>

            {/* Right Column */}
            <div>
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
            </div>
          </div>
        </div>

        <DialogFooter
          onClose={onClose}
          onSave={onTeamUpdated}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}