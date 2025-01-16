import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { AdminTeamActions } from "../AdminTeamActions";

interface TeamHeaderProps {
  name: string;
  status: string;
  id: string;
  teamName: string;
  mentorId: string | null;
  techStackId: string | null;
  repositoryUrl: string | null;
  getStatusColor: (status: string) => string;
}

export function TeamHeader({
  name,
  status,
  id,
  teamName,
  mentorId,
  techStackId,
  repositoryUrl,
  getStatusColor,
}: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Badge>
        <AdminTeamActions
          teamId={id}
          teamName={teamName}
          currentMentorId={mentorId}
          teamTechStackId={techStackId}
          repositoryUrl={repositoryUrl}
        />
      </div>
    </div>
  );
}