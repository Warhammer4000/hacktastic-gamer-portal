import { Card } from "@/components/ui/card";
import { CreateTeamDialog } from "../CreateTeamDialog";
import { JoinTeamSection } from "../JoinTeamSection";

export function CreateTeamSection({ maxMembers }: { maxMembers: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 h-[calc(100vh-12rem)]">
      <Card className="h-full">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Create a Team</h2>
          <p className="text-muted-foreground mb-4">
            Start your own team and invite others to join
          </p>
          <div className="mt-auto">
            <CreateTeamDialog maxMembers={maxMembers} />
          </div>
        </div>
      </Card>

      <JoinTeamSection />
    </div>
  );
}