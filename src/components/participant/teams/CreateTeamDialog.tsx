import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TeamForm, type TeamFormValues } from "./forms/TeamForm";
import { ParticipantSelect } from "@/pages/admin/teams/components/ParticipantSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated?: () => Promise<void>;
}

export function CreateTeamDialog({ isOpen, onClose, onTeamCreated }: CreateTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStackId, setTechStackId] = useState("");
  const [leaderId, setLeaderId] = useState("");

  const { data: techStacks, isLoading: isLoadingTechStacks } = useQuery({
    queryKey: ['technology-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: teamSettings } = useQuery({
    queryKey: ['team-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderId) {
      toast.error("Please select a team leader");
      return;
    }

    try {
      setIsSubmitting(true);
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const maxMembers = teamSettings?.max_team_size || 3;

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name,
          description,
          tech_stack_id: techStackId,
          leader_id: leaderId,
          join_code: joinCode,
          max_members: maxMembers,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add the team leader as a team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: leaderId,
          is_ready: true, // Leader is automatically ready
        });

      if (memberError) throw memberError;

      toast.success("Team created successfully!");
      if (onTeamCreated) {
        await onTeamCreated();
      }
      onClose();
    } catch (error) {
      toast.error("Failed to create team. Please try again.");
      console.error("Error creating team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>Team Leader</Label>
            <ParticipantSelect
              value={leaderId}
              onValueChange={setLeaderId}
              teamId=""
              teamMembers={[]}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}