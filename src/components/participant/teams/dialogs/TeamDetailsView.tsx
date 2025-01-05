import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TeamDetailsViewProps {
  team: {
    name: string;
    description: string | null;
    status: string;
    tech_stack: {
      name: string;
    } | null;
    repository_url: string | null;
  };
  isTeamLeader: boolean;
  isLocked: boolean;
  onEdit: () => void;
}

export function TeamDetailsView({
  team,
  isTeamLeader,
  isLocked,
  onEdit,
}: TeamDetailsViewProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{team.name}</DialogTitle>
        {team.description && (
          <DialogDescription>
            {team.description}
          </DialogDescription>
        )}
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <h4 className="font-medium">Team Details</h4>
          <p className="text-sm text-muted-foreground">Status: {team.status}</p>
          {team.tech_stack && (
            <p className="text-sm text-muted-foreground">
              Tech Stack: {team.tech_stack.name}
            </p>
          )}
          {team.repository_url && (
            <p className="text-sm text-muted-foreground">
              Repository: <a href={team.repository_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View on GitHub</a>
            </p>
          )}
        </div>
        {isTeamLeader && !isLocked && (
          <Button onClick={onEdit}>
            Edit Team
          </Button>
        )}
      </div>
    </>
  );
}