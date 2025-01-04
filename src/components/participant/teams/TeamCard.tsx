import { Users, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeamCardProps {
  team: {
    name: string;
    description: string | null;
    status: string;
    tech_stack: {
      name: string;
      icon_url: string;
    } | null;
  };
  onViewTeam: () => void;
  onDeleteTeam: () => void;
  isLocked: boolean;
}

export function TeamCard({ team, onViewTeam, onDeleteTeam, isLocked }: TeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-medium">{team.name}</p>
          {team.description && (
            <p className="text-sm text-muted-foreground">
              {team.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Status: {team.status}
          </p>
          {team.tech_stack && (
            <p className="text-sm text-muted-foreground">
              Tech Stack: {team.tech_stack.name}
            </p>
          )}
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={onViewTeam}>
              <Users className="mr-2 h-4 w-4" />
              View Team
            </Button>
            {!isLocked && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onDeleteTeam}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Team
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}