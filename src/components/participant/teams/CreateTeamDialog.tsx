import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TeamForm, type TeamFormValues } from "./forms/TeamForm";

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
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

  async function onSubmit(data: TeamFormValues) {
    try {
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: team, error } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          description: data.description,
          tech_stack_id: data.techStackId,
          join_code: joinCode,
          leader_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (memberError) throw memberError;

      toast.success("Team created successfully!");
      setOpen(false);
      navigate(0);
    } catch (error) {
      toast.error("Failed to create team. Please try again.");
      console.error("Error creating team:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
          <DialogDescription>
            Create your team and invite others to join using a team code.
          </DialogDescription>
        </DialogHeader>

        <TeamForm
          onSubmit={onSubmit}
          techStacks={techStacks}
          isLoadingTechStacks={isLoadingTechStacks}
        />
      </DialogContent>
    </Dialog>
  );
}