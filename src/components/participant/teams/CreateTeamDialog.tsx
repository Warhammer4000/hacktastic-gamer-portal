import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TeamForm, type TeamFormValues } from "./forms/TeamForm";

interface CreateTeamDialogProps {
  maxMembers: number;
}

export function CreateTeamDialog({ maxMembers }: CreateTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (data: TeamFormValues) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate a random 6-character join code
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          description: data.description,
          tech_stack_id: data.techStackId,
          leader_id: user.id,
          join_code: joinCode,
          max_members: maxMembers,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add the creator as a team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
        });

      if (memberError) throw memberError;

      toast.success("Team created successfully!");
      navigate(0);
    } catch (error) {
      toast.error("Failed to create team. Please try again.");
      console.error("Error creating team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TeamForm
      onSubmit={handleSubmit}
      techStacks={techStacks}
      isLoadingTechStacks={isLoadingTechStacks}
      submitLabel="Create Team"
      isLoading={isLoading}
    />
  );
}