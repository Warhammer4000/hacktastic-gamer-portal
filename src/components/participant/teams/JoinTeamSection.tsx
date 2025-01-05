import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { TeamListItem } from "./components/TeamListItem";
import { JoinTeamForm } from "./components/JoinTeamForm";
import { TeamFilters } from "./components/TeamFilters";

export function JoinTeamSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState("all");
  
  const { data: techStacks } = useQuery({
    queryKey: ['tech-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active');
      if (error) throw error;
      return data;
    },
  });

  const { data: availableTeams, refetch } = useQuery({
    queryKey: ['available-teams', searchQuery, selectedTechStack],
    queryFn: async () => {
      let query = supabase
        .from('teams')
        .select(`
          id,
          name,
          description,
          tech_stack:tech_stack_id (
            name,
            icon_url
          ),
          team_members (
            id
          )
        `)
        .neq('status', 'locked');

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (selectedTechStack && selectedTechStack !== 'all') {
        query = query.eq('tech_stack_id', selectedTechStack);
      }

      const { data: teams, error } = await query;
      if (error) throw error;
      return teams.filter(team => team.team_members.length < 3);
    },
  });

  const handleJoinWithCode = async (data: { joinCode: string }) => {
    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('join_code', data.joinCode.toUpperCase())
        .maybeSingle();

      if (teamError || !team) {
        toast.error("Invalid team code. Please try again.");
        return;
      }

      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (memberError) {
        if (memberError.code === '23505') {
          toast.error("You are already a member of this team.");
        } else {
          toast.error("Failed to join team. Please try again.");
        }
        return;
      }

      toast.success("Successfully joined team!");
      refetch();
    } catch (error) {
      toast.error("Failed to join team. Please try again.");
      console.error("Error joining team:", error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("You are already a member of this team");
        } else {
          toast.error("Failed to join team");
        }
        return;
      }

      toast.success("Successfully joined team!");
      refetch();
    } catch (error) {
      toast.error("Failed to join team");
      console.error("Error joining team:", error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Join Team</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 h-[calc(100%-5rem)] flex flex-col">
        <JoinTeamForm onSubmit={handleJoinWithCode} />

        <div className="space-y-4 flex-1 flex flex-col">
          <TeamFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTechStack={selectedTechStack}
            onTechStackChange={setSelectedTechStack}
            techStacks={techStacks}
          />

          <ScrollArea className="flex-1 rounded-md border p-4">
            <div className="space-y-4">
              {availableTeams?.map((team) => (
                <TeamListItem
                  key={team.id}
                  team={team}
                  onJoin={handleJoinTeam}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}