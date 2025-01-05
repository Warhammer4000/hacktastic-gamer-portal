import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TeamListItemProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    tech_stack: {
      name: string;
    } | null;
    team_members: { id: string; }[];
  };
  onJoin: (teamId: string) => Promise<void>;
}

export function TeamListItem({ team, onJoin }: TeamListItemProps) {
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      await onJoin(team.id);
      // After successfully joining, refresh the page to show the current team view
      navigate(0);
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <h3 className="font-medium">{team.name}</h3>
        {team.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {team.description}
          </p>
        )}
        {team.tech_stack && (
          <p className="text-sm text-muted-foreground mt-1">
            Tech Stack: {team.tech_stack.name}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          Members: {team.team_members.length}/3
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleJoin}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Join
      </Button>
    </div>
  );
}