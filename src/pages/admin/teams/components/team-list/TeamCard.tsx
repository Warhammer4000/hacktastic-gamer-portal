import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TeamHeader } from "./TeamHeader";
import { TeamInfo } from "./TeamInfo";

interface TeamCardProps {
  team: any;
  getStatusColor: (status: string) => string;
}

export function TeamCard({ team, getStatusColor }: TeamCardProps) {
  return (
    <Card key={team.id} className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <TeamHeader
          name={team.name}
          status={team.status}
          id={team.id}
          teamName={team.name}
          mentorId={team.mentor_id}
          techStackId={team.tech_stack_id}
          repositoryUrl={team.repository_url}
          getStatusColor={getStatusColor}
        />
      </CardHeader>
      <CardContent className="pt-6">
        <TeamInfo
          description={team.description}
          techStack={team.tech_stack}
          leader={team.leader}
          teamMembers={team.team_members}
          maxMembers={team.max_members}
          mentor={team.mentor}
          repositoryUrl={team.repository_url}
        />
      </CardContent>
    </Card>
  );
}