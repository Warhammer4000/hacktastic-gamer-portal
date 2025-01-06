import { Users, Code2, School, Mail, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MenteeTeamCardProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    repository_url: string | null;
    tech_stack: {
      name: string;
      icon_url: string;
    } | null;
    team_members: {
      id: string;
      is_ready: boolean;
      profile: {
        id: string;
        full_name: string | null;
        email: string;
        avatar_url: string | null;
        github_username: string | null;
        linkedin_profile_id: string | null;
        institution: {
          name: string;
        } | null;
      };
    }[];
    leader_id: string;
  };
}

export function MenteeTeamCard({ team }: MenteeTeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {team.name}
          </CardTitle>
          <Badge variant="outline">{team.status}</Badge>
        </div>
        {team.description && (
          <p className="text-sm text-muted-foreground">{team.description}</p>
        )}
        <div className="flex flex-col gap-2 mt-2">
          {team.tech_stack && (
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {team.tech_stack.name}
              </span>
            </div>
          )}
          {team.repository_url && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                asChild
              >
                <a
                  href={team.repository_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 className="h-4 w-4" />
                  View Repository
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {team.team_members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={member.profile?.avatar_url || ""}
                    alt={member.profile?.full_name || "Team Member"}
                  />
                  <AvatarFallback>
                    {member.profile?.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {member.profile?.full_name || "Unknown User"}
                    </h3>
                    {team.leader_id === member.profile?.id && (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" />
                        Leader
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {member.profile?.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {member.profile.email}
                        </span>
                      </div>
                    )}
                    {member.profile?.institution && (
                      <div className="flex items-center gap-1">
                        <School className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {member.profile.institution.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {member.profile?.github_username && (
                  <a
                    href={`https://github.com/${member.profile.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                      />
                    </svg>
                  </a>
                )}
                {member.profile?.linkedin_profile_id && (
                  <a
                    href={`https://linkedin.com/in/${member.profile.linkedin_profile_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}