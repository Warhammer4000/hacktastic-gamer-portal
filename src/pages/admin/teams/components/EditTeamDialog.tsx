import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TeamMemberManagement } from "./edit-team/TeamMemberManagement";
import { TeamBasicInfoFields } from "./edit-team/TeamBasicInfoFields";
import { TeamStatusSection } from "./edit-team/TeamStatusSection";
import type { TeamStatus } from "./edit-team/types";

interface EditTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated: () => void;
  teamId: string;
}

export function EditTeamDialog({ isOpen, onClose, onTeamUpdated, teamId }: EditTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (
            id,
            user_id,
            profile:profiles (
              id,
              full_name,
              email
            )
          )
        `)
        .eq("id", teamId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: participants = [], isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["available-participants", teamId],
    queryFn: async () => {
      if (!team?.team_members) return [];
      
      const memberIds = team.team_members.map(m => m.user_id);
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          user_roles!inner (role)
        `)
        .eq("user_roles.role", "participant")
        .not("id", "in", `(${memberIds.join(",")})`)
        .order("full_name");

      if (error) throw error;
      return data || [];
    },
    enabled: !!team,
  });

  const handleMemberAdd = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .insert({ team_id: teamId, user_id: memberId });

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["available-participants", teamId] });
      toast.success("Team member added successfully");
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  const handleMemberRemove = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId)
        .eq("user_id", memberId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      queryClient.invalidateQueries({ queryKey: ["available-participants", teamId] });
      toast.success("Team member removed successfully");
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    }
  };

  const handleLeaderChange = async (newLeaderId: string) => {
    try {
      const { error } = await supabase
        .from("teams")
        .update({ leader_id: newLeaderId })
        .eq("id", teamId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      toast.success("Team leader updated successfully");
    } catch (error) {
      console.error("Error updating team leader:", error);
      toast.error("Failed to update team leader");
    }
  };

  if (!team || isLoadingTeam) {
    return null;
  }

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
            onUpdate={async (data) => {
              try {
                const { error } = await supabase
                  .from("teams")
                  .update(data)
                  .eq("id", teamId);

                if (error) throw error;
                queryClient.invalidateQueries({ queryKey: ["team", teamId] });
                toast.success("Team updated successfully");
              } catch (error) {
                console.error("Error updating team:", error);
                toast.error("Failed to update team");
              }
            }}
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
            onStatusChange={async (newStatus) => {
              try {
                const { error } = await supabase
                  .from("teams")
                  .update({ status: newStatus })
                  .eq("id", teamId);

                if (error) throw error;
                queryClient.invalidateQueries({ queryKey: ["team", teamId] });
                toast.success("Team status updated successfully");
              } catch (error) {
                console.error("Error updating team status:", error);
                toast.error("Failed to update team status");
              }
            }}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={onTeamUpdated}
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}