import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamFilters } from "@/components/participant/teams/components/TeamFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState("all");

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
          leader:profiles(
            id,
            full_name,
            avatar_url
          ),
          mentor:profiles(
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

  const filteredTeams = teams?.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTechStack = selectedTechStack === "all" || team.tech_stack?.id === selectedTechStack;

    return matchesSearch && matchesTechStack;
  });

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Team Explorer</h1>
      
      <div className="mb-6">
        <TeamFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTechStack={selectedTechStack}
          onTechStackChange={setSelectedTechStack}
          techStacks={techStacks}
        />
      </div>

      <div className="space-y-4">
        {isTeamsLoading ? (
          <div>Loading teams...</div>
        ) : (
          filteredTeams?.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {team.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {team.description && (
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Tech Stack</h4>
                      <p className="text-sm text-muted-foreground">
                        {team.tech_stack?.name || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">Status</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {team.status}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">Members</h4>
                      <p className="text-sm text-muted-foreground">
                        {team.team_members?.length || 0} / {team.max_members || 3}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Team Leader</h4>
                      <p className="text-sm text-muted-foreground">
                        {team.leader?.full_name}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm">Mentor</h4>
                      <p className="text-sm text-muted-foreground">
                        {team.mentor?.full_name || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}