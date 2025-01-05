import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TeamForm, type TeamFormValues } from "./forms/TeamForm";

interface CreateTeamDialogProps {
  maxMembers: number;
  onTeamCreated?: () => Promise<void>;
}

export function CreateTeamDialog({ maxMembers, onTeamCreated }: CreateTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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

      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
        });

      if (memberError) throw memberError;

      toast.success("Team created successfully!");
      if (onTeamCreated) {
        await onTeamCreated();
      }
    } catch (error) {
      toast.error("Failed to create team. Please try again.");
      console.error("Error creating team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TeamForm
      onSubmit={handleSubmit}
      techStacks={techStacks}
      isLoadingTechStacks={isLoadingTechStacks}
      submitLabel="Create Team"
      isSubmitting={isSubmitting}
    />
  );
}