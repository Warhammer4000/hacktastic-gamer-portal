import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamFilters } from "@/components/participant/teams/components/TeamFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Github, Linkedin, Blocks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AdminTeamActions } from "./components/AdminTeamActions";

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
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-muted/50">
                <CardHeader>
                  <div className="h-6 w-1/3 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                    <div className="h-4 w-1/4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          filteredTeams?.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{team.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(team.status)}>
                      {team.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <AdminTeamActions
                      teamId={team.id}
                      teamName={team.name}
                      currentMentorId={team.mentor_id}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {team.description && (
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Blocks className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          {team.tech_stack?.icon_url && (
                            <Avatar className="h-5 w-5">
                              <AvatarImage 
                                src={team.tech_stack.icon_url} 
                                alt={team.tech_stack.name} 
                              />
                              <AvatarFallback>
                                {team.tech_stack.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-sm font-medium">
                            {team.tech_stack?.name || "Not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          {team.leader?.avatar_url && (
                            <Avatar className="h-5 w-5">
                              <AvatarImage 
                                src={team.leader.avatar_url} 
                                alt={team.leader.full_name || ''} 
                              />
                              <AvatarFallback>
                                {team.leader.full_name?.[0] || 'L'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-sm font-medium">
                            {team.leader?.full_name || "Unknown Leader"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {team.team_members?.length || 0} / {team.max_members || 3} Members
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {team.mentor && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                              {team.mentor.avatar_url && (
                                <Avatar className="h-5 w-5">
                                  <AvatarImage 
                                    src={team.mentor.avatar_url} 
                                    alt={team.mentor.full_name || ''} 
                                  />
                                  <AvatarFallback>
                                    {team.mentor.full_name?.[0] || 'M'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <span className="text-sm font-medium">
                                {team.mentor.full_name}
                              </span>
                            </div>
                          </div>
                          
                          {team.mentor.linkedin_profile_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 pl-7"
                              asChild
                            >
                              <a
                                href={`https://linkedin.com/in/${team.mentor.linkedin_profile_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                              >
                                <Linkedin className="h-4 w-4" />
                                LinkedIn Profile
                              </a>
                            </Button>
                          )}
                        </div>
                      )}

                      {team.repository_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 pl-7"
                          asChild
                        >
                          <a
                            href={team.repository_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                          >
                            <Github className="h-4 w-4" />
                            View Repository
                          </a>
                        </Button>
                      )}
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