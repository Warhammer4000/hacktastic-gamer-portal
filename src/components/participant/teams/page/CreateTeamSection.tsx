import { Card } from "@/components/ui/card";
import { CreateTeamDialog } from "../CreateTeamDialog";
import { JoinTeamDialog } from "../JoinTeamDialog";

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

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Join a Team</h2>
          <p className="text-muted-foreground mb-4">
            Join an existing team using their team code
          </p>
          <JoinTeamDialog />
        </div>
      </Card>
    </div>
  );
}