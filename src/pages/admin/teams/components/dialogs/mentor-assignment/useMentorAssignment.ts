import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { MentorWithTeams } from "../types";

export function useMentorAssignment(teamId: string, teamTechStackId: string | null) {
  const [search, setSearch] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: mentors, isLoading } = useQuery({
    queryKey: ["eligible-mentors", teamTechStackId],
    queryFn: async () => {
      const { data: mentorsData, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          mentor_tech_stacks!inner (
            technology_stacks (
              id,
              name
            )
          )
        `)
        .eq("mentor_tech_stacks.tech_stack_id", teamTechStackId);

      if (error) throw error;

      // Get team counts for each mentor
      const mentorsWithTeams = await Promise.all(
        mentorsData.map(async (mentor) => {
          const { data: teams } = await supabase
            .from("teams")
            .select("id")
            .eq("mentor_id", mentor.id)
            .eq("status", "locked");

          const { data: preferences } = await supabase
            .from("mentor_preferences")
            .select("team_count")
            .eq("mentor_id", mentor.id)
            .maybeSingle();

          return {
            ...mentor,
            team_count: teams?.length || 0,
            max_teams: preferences?.team_count || 2, // Default to 2 if no preferences set
          };
        })
      );

      return mentorsWithTeams.filter(
        (mentor) => mentor.team_count < mentor.max_teams
      ) as MentorWithTeams[];
    },
    enabled: !!teamTechStackId,
  });

  const filteredMentors = mentors?.filter((mentor) => {
    const searchTerm = search.toLowerCase();
    return (
      mentor.full_name?.toLowerCase().includes(searchTerm) ||
      mentor.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleAutoAssign = async () => {
    setIsAssigning(true);
    try {
      const { data: mentorId, error } = await supabase.rpc(
        "assign_mentor_to_team",
        { team_id: teamId }
      );

      if (error) throw error;

      if (mentorId) {
        toast.success("Mentor assigned successfully!");
        return true;
      } else {
        toast.error("No eligible mentors available");
        return false;
      }
    } catch (error) {
      console.error("Error auto-assigning mentor:", error);
      toast.error("Failed to auto-assign mentor");
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  const handleManualAssign = async () => {
    if (!selectedMentorId) {
      toast.error("Please select a mentor");
      return false;
    }

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from("teams")
        .update({ mentor_id: selectedMentorId, status: "active" })
        .eq("id", teamId);

      if (error) throw error;

      toast.success("Mentor assigned successfully!");
      return true;
    } catch (error) {
      console.error("Error assigning mentor:", error);
      toast.error("Failed to assign mentor");
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    mentors: filteredMentors,
    isLoading,
    search,
    setSearch,
    selectedMentorId,
    setSelectedMentorId,
    isAssigning,
    handleAutoAssign,
    handleManualAssign,
  };
}