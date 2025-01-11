import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TeamStateSelect } from "./TeamStateSelect";
import { TeamMemberSelect } from "./TeamMemberSelect";
import { Separator } from "@/components/ui/separator";

type TeamStatus = "draft" | "open" | "locked" | "active" | "pending_mentor";

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
  const [leaderId, setLeaderId] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [status, setStatus] = useState<TeamStatus>("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");

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
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          user_roles!inner (role)
        `)
        .eq('user_roles.role', 'participant')
        .not('id', 'in', `(${team?.team_members?.map(m => m.user_id).join(',') || ''})`)
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
      setLeaderId(team.leader_id);
      setRepositoryUrl(team.repository_url || "");
      setStatus(team.status as TeamStatus);
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
          leader_id: leaderId,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech-stack">Technology Stack</Label>
              <Select value={techStackId} onValueChange={setTechStackId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select tech stack" />
                </SelectTrigger>
                <SelectContent>
                  {techStacks?.map((stack) => (
                    <SelectItem key={stack.id} value={stack.id}>
                      {stack.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repository">Repository URL</Label>
              <Input
                id="repository"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
              />
            </div>

            <div className="space-y-2">
              <Label>Team Status</Label>
              <TeamStateSelect
                currentState={status}
                onStateChange={(newState) => setStatus(newState as TeamStatus)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Team Members</Label>
            <div className="space-y-4">
              {team?.team_members?.map((member) => (
                <div key={member.user_id} className="flex items-center justify-between">
                  <span>{member.profile.full_name || member.profile.email}</span>
                  {member.user_id !== team.leader_id && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMember(member.user_id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Add Team Member</Label>
              <TeamMemberSelect
                value={selectedMemberId}
                onValueChange={(value) => {
                  setSelectedMemberId(value);
                  if (value) handleAddMember(value);
                }}
                participants={participants || []}
                isLoading={isLoadingParticipants}
              />
            </div>
          </div>

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