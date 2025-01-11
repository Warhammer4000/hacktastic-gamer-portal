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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: team } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });

  useEffect(() => {
    if (team) {
      setName(team.name);
      setDescription(team.description || "");
      setTechStackId(team.tech_stack_id || "");
      setLeaderId(team.leader_id);
      setRepositoryUrl(team.repository_url || "");
    }
  }, [team]);

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

  const { data: participants } = useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          user_roles!inner (role)
        `)
        .eq("user_roles.role", "participant");
      if (error) throw error;
      return data;
    },
  });

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
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
            <Label htmlFor="leader">Team Leader</Label>
            <Select value={leaderId} onValueChange={setLeaderId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select team leader" />
              </SelectTrigger>
              <SelectContent>
                {participants?.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.full_name || participant.email}
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