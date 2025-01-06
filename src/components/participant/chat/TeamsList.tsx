import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TeamsListProps {
  teams?: Array<{
    id: string;
    name: string;
  }>;
  selectedTeamId: string | null;
  onTeamSelect: (teamId: string) => void;
}

export function TeamsList({ teams, selectedTeamId, onTeamSelect }: TeamsListProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold p-4">Your Teams</h2>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {teams?.map((team) => (
            <Button
              key={team.id}
              variant={selectedTeamId === team.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                selectedTeamId === team.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onTeamSelect(team.id)}
            >
              {team.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}