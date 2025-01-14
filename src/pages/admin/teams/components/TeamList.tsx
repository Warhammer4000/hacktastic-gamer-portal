import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, User, Github, Linkedin, Blocks } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamListProps {
  teams: any[];
  isLoading: boolean;
  onEditTeam: (teamId: string) => void;
  onAssignMentor: (teamId: string) => void;
  onDeleteTeam: (teamId: string) => void;
  getStatusColor: (status: string) => string;
}

export function TeamList({
  teams,
  isLoading,
  onEditTeam,
  onAssignMentor,
  onDeleteTeam,
  getStatusColor
}: TeamListProps) {
  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      {teams?.map((team) => (
        <Card key={team.id} className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{team.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(team.status)}>
                  {team.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTeam(team.id)}
                >
                  Edit
                </Button>
                {!team.mentor_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAssignMentor(team.id)}
                  >
                    Assign Mentor
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteTeam(team.id)}
                >
                  Delete
                </Button>
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
      ))}
    </div>
  );
}
