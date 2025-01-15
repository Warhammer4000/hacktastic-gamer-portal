import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CreateTeamDialog } from "../CreateTeamDialog";
import { JoinTeamSection } from "../JoinTeamSection";
import { Button } from "@/components/ui/button";

interface CreateTeamSectionProps {
  onTeamJoined: () => Promise<void>;
}

export function CreateTeamSection({ onTeamJoined }: CreateTeamSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-2 h-[calc(100vh-12rem)]">
      <Card className="h-full">
        <div className="p-8 h-full flex flex-col">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold">Create a Team</h2>
            <p className="text-muted-foreground">
              Start your own team and invite others to join
            </p>
          </div>
          <div className="flex-1">
            <Button onClick={() => setIsDialogOpen(true)}>
              Create New Team
            </Button>
            <CreateTeamDialog 
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onTeamCreated={onTeamJoined}
            />
          </div>
        </div>
      </Card>

      <JoinTeamSection onTeamJoined={onTeamJoined} />
    </div>
  );
}