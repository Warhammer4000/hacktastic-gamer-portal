import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTeamMemberActions(teamId: string, currentUserId: string | undefined) {
  const queryClient = useQueryClient();

  const readyMutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from('team_members')
        .update({ is_ready: true })
        .eq('team_id', teamId)
        .eq('user_id', currentUserId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      toast.success("Marked as ready!");
    },
    onError: (error) => {
      console.error("Error updating ready status:", error);
      toast.error("Failed to update ready status");
    },
  });

  const leaveTeamMutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', currentUserId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Left team successfully");
      queryClient.invalidateQueries({ queryKey: ['participant-team'] });
    },
    onError: (error) => {
      console.error('Error leaving team:', error);
      toast.error("Failed to leave team");
    },
  });

  const handleReadyToggle = () => {
    readyMutation.mutate();
  };

  const handleLeaveTeam = async () => {
    if (window.confirm("Are you sure you want to leave this team?")) {
      return leaveTeamMutation.mutateAsync();
    }
    return Promise.resolve();
  };

  return {
    handleReadyToggle,
    handleLeaveTeam,
  };
}