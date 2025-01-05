import { Card } from "@/components/ui/card";
import { CreateTeamDialog } from "../CreateTeamDialog";
import { JoinTeamSection } from "../JoinTeamSection";

export function CreateTeamSection({ maxMembers }: { maxMembers: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create a Team</h2>
          <p className="text-muted-foreground mb-4">
            Start your own team and invite others to join
          </p>
          <CreateTeamDialog maxMembers={maxMembers} />
        </div>
      </Card>

      <JoinTeamSection />
    </div>
  );
}