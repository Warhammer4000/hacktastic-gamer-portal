import { Users, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamMemberCard } from "./TeamMemberCard";

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
      } | null;
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
            <TeamMemberCard
              key={member.id}
              member={member}
              isLeader={team.leader_id === member.profile?.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}