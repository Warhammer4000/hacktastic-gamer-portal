import { useState } from "react";
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

interface CreateTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
}

export function CreateTeamDialog({ isOpen, onClose, onTeamCreated }: CreateTeamDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStackId, setTechStackId] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // First create the team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          name,
          description,
          tech_stack_id: techStackId,
          leader_id: leaderId,
          join_code: joinCode,
          status: "draft",
          max_members: teamSettings?.max_team_size,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Then add the team leader as a team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: leaderId,
          is_ready: true, // Leader is automatically ready
        });

      if (memberError) throw memberError;

      toast.success("Team created successfully!");
      onTeamCreated();
      onClose();
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
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