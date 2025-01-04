import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AvailableTeamsCard() {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const { data: availableTeams, refetch } = useQuery({
    queryKey: ['available-teams'],
    queryFn: async () => {
      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          description,
          tech_stack:tech_stack_id (
            name
          ),
          team_members (
            id
          )
        `)
        .neq('status', 'locked');

      if (error) throw error;
      return teams.filter(team => team.team_members.length < 3);
    },
  });

  const handleJoinTeam = async (teamId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("You are already a member of this team");
        } else {
          toast.error("Failed to join team");
        }
        return;
      }

      toast.success("Successfully joined team!");
      setSelectedTeam(null);
      refetch();
    } catch (error) {
      toast.error("Failed to join team");
      console.error("Error joining team:", error);
    }
  };

  if (!availableTeams?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Teams</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availableTeams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
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
                onClick={() => setSelectedTeam(team)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Team</DialogTitle>
              <DialogDescription>
                Are you sure you want to join {selectedTeam?.name}?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedTeam(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleJoinTeam(selectedTeam?.id)}
              >
                Join Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}