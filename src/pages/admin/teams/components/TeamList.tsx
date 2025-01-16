import { TeamListSkeleton } from "./team-list/TeamListSkeleton";
import { TeamCard } from "./team-list/TeamCard";

interface TeamListProps {
  teams: any[];
  isLoading: boolean;
  onAssignMentor: (teamId: string) => void;
  getStatusColor: (status: string) => string;
}

export function TeamList({
  teams,
  isLoading,
  onAssignMentor,
  getStatusColor
}: TeamListProps) {
  if (isLoading) {
    return <TeamListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {teams?.map((team) => (
        <TeamCard 
          key={team.id} 
          team={team} 
          getStatusColor={getStatusColor} 
        />
      ))}
    </div>
  );
}