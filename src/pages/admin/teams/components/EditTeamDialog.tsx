import { useState, useEffect } from "react";
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
import { TeamBasicInfoFields } from "./edit-team/TeamBasicInfoFields";
import { TeamMembersSection } from "./edit-team/TeamMembersSection";
import { TeamStatusSection } from "./edit-team/TeamStatusSection";
import type { TeamFormValues } from "./forms/TeamForm";

interface EditTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated: () => void;
  teamId: string;
}

export function EditTeamDialog({ isOpen, onClose, onTeamUpdated, teamId }: EditTeamDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStackId, setTechStackId] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [status, setStatus] = useState<string>("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const queryClient = useQueryClient();

  const { data: team, isLoading: isTeamLoading } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (
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
    enabled: !!teamId,
  });

  const { data: techStacks } = useQuery({
    queryKey: ["tech-stacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      if (!team?.team_members) return [];
      
      const memberIds = team.team_members.map(m => m.user_id).join(',');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          user_roles!inner (role)
        `)
        .eq('user_roles.role', 'participant')
        .not('id', 'in', `(${memberIds})`)
        .order('full_name');

      if (error) throw error;
      return data;
    },
    enabled: !!team,
  });

  useEffect(() => {
    if (team) {
      setName(team.name);
      setDescription(team.description || "");
      setTechStackId(team.tech_stack_id || "");
      setRepositoryUrl(team.repository_url || "");
      setStatus(team.status);
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error: teamError } = await supabase
        .from("teams")
        .update({
          name,
          description,
          tech_stack_id: techStackId,
          repository_url: repositoryUrl,
          status,
        })
        .eq("id", teamId);

      if (teamError) throw teamError;

      toast.success("Team updated successfully!");
      onTeamUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          user_id: memberId,
        });

      if (error) throw error;

      toast.success("Team member added successfully!");
      onTeamUpdated();
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId)
        .eq("user_id", memberId);

      if (error) throw error;

      toast.success("Team member removed successfully!");
      onTeamUpdated();
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    }
  };

  if (!team) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <p>Team details are not available.</p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TeamBasicInfoFields
            name={name}
            description={description}
            techStackId={techStackId}
            repositoryUrl={repositoryUrl}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onTechStackChange={setTechStackId}
            onRepositoryUrlChange={setRepositoryUrl}
            techStacks={techStacks}
          />

          <TeamStatusSection 
            status={status} 
            onStatusChange={(newState) => setStatus(newState)} 
          />

          <TeamMembersSection
            teamMembers={team.team_members}
            participants={participants}
            isLoadingParticipants={isLoadingParticipants}
            selectedMemberId={selectedMemberId}
            onMemberSelect={(value) => {
              setSelectedMemberId(value);
              if (value) handleAddMember(value);
            }}
            onRemoveMember={handleRemoveMember}
            leaderId={team.leader_id}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Update Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}