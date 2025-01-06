import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMembersCount {
  count: number;
}

interface TechnologyStack {
  name: string;
}

interface Team {
  id: string;
  name: string;
  team_members: TeamMembersCount[];
  technology_stacks: TechnologyStack;
}

export function UnassignedTeams() {
  const { data: teams } = useQuery({
    queryKey: ["unassigned-teams"],
    queryFn: async () => {
      const { data } = await supabase
        .from("teams")
        .select(`
          id,
          name,
          team_members!inner (
            count
          ),
          technology_stacks (
            name
          )
        `)
        .is('mentor_id', null)
        .eq('status', 'locked');

      return data as Team[];
    },
  });

  const handleAssignMentor = async (teamId: string) => {
    const { data: mentorId } = await supabase
      .rpc('assign_mentor_to_team', { team_id: teamId });
    
    if (mentorId) {
      console.log('Mentor assigned successfully:', mentorId);
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Teams Awaiting Mentor Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <div className="space-y-4">
            {teams?.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h4 className="font-semibold">{team.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {team.technology_stacks?.name} • {team.team_members[0]?.count} members
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAssignMentor(team.id)}
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Assign Mentor
                </Button>
              </div>
            ))}
            {!teams?.length && (
              <p className="text-center text-muted-foreground">
                No teams currently awaiting mentor assignment
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}