import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";

export const teamMutations = {
  updateBasicInfo: async (
    teamId: string, 
    data: { name: string; description: string; tech_stack_id: string | null },
    queryClient: QueryClient
  ) => {
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
  },

  updateTeamStatus: async (
    teamId: string, 
    status: "draft" | "open" | "locked" | "active" | "pending_mentor",
    queryClient: QueryClient
  ) => {
    try {
      const { error } = await supabase
        .from("teams")
        .update({ status })
        .eq("id", teamId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      toast.success("Team status updated successfully");
    } catch (error) {
      console.error("Error updating team status:", error);
      toast.error("Failed to update team status");
    }
  },

  updateTeamLeader: async (
    teamId: string,
    leaderId: string,
    queryClient: QueryClient
  ) => {
    try {
      const { error } = await supabase
        .from("teams")
        .update({ leader_id: leaderId })
        .eq("id", teamId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
      toast.success("Team leader updated successfully");
    } catch (error) {
      console.error("Error updating team leader:", error);
      toast.error("Failed to update team leader");
    }
  },

  addTeamMember: async (
    teamId: string,
    memberId: string,
    queryClient: QueryClient
  ) => {
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
  },

  removeTeamMember: async (
    teamId: string,
    memberId: string,
    queryClient: QueryClient
  ) => {
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
  }
};