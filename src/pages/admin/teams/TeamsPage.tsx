import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateTeamDialog } from "./components/CreateTeamDialog";
import { AssignMentorDialog } from "./components/dialogs/mentor-assignment/AssignMentorDialog";
import { TeamHeader } from "./components/TeamHeader";
import { TeamList } from "./components/TeamList";

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignMentorDialogOpen, setIsAssignMentorDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: teams, isLoading: isTeamsLoading } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          tech_stack:technology_stacks(
            id,
            name,
            icon_url
          ),
          team_members(
            id,
            user:profiles(
              id,
              full_name,
              avatar_url
            )
          ),
          leader:profiles!teams_leader_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          mentor:profiles!teams_mentor_id_fkey(
            id,
            full_name,
            avatar_url,
            linkedin_profile_id
          )
        `);

      if (error) throw error;
      return data;
    },
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

  const handleCreateTeam = () => {
    setIsCreateDialogOpen(true);
  };

  const handleAssignMentor = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsAssignMentorDialogOpen(true);
  };

  const filteredTeams = teams?.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTechStack = selectedTechStack === "all" || team.tech_stack?.id === selectedTechStack;

    return matchesSearch && matchesTechStack;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'locked':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_mentor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedTeam = teams?.find(team => team.id === selectedTeamId);

  return (
    <div className="container py-6">
      <TeamHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTechStack={selectedTechStack}
        onTechStackChange={setSelectedTechStack}
        techStacks={techStacks || []}
        onCreateTeam={handleCreateTeam}
      />

      <TeamList
        teams={filteredTeams || []}
        isLoading={isTeamsLoading}
        onAssignMentor={handleAssignMentor}
        getStatusColor={getStatusColor}
      />

      <CreateTeamDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onTeamCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
        }}
      />

      {selectedTeamId && (
        <AssignMentorDialog
          open={isAssignMentorDialogOpen}
          onOpenChange={(open) => {
            setIsAssignMentorDialogOpen(open);
            if (!open) setSelectedTeamId(null);
          }}
          onConfirm={() => {
            queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
          }}
          teamId={selectedTeamId}
          teamName={selectedTeam?.name || ''}
          teamTechStackId={selectedTeam?.tech_stack?.id || null}
          currentMentorId={selectedTeam?.mentor_id || null}
        />
      )}
    </div>
  );
}