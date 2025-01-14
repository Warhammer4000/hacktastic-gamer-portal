import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamFilters } from "@/components/participant/teams/components/TeamFilters";

interface TeamHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTechStack: string;
  onTechStackChange: (value: string) => void;
  techStacks: any[];
  onCreateTeam: () => void;
}

export function TeamHeader({
  searchQuery,
  onSearchChange,
  selectedTechStack,
  onTechStackChange,
  techStacks,
  onCreateTeam
}: TeamHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Explorer</h1>
        <Button onClick={onCreateTeam}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>
      
      <div className="mb-6">
        <TeamFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedTechStack={selectedTechStack}
          onTechStackChange={onTechStackChange}
          techStacks={techStacks}
        />
      </div>
    </>
  );
}