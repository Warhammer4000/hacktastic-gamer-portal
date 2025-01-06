import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, UserCheck, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TeamMembersCount {
  count: number;
}

interface TechnologyStack {
  name: string;
  icon_url: string;
}

interface Team {
  id: string;
  name: string;
  team_members: TeamMembersCount[];
  technology_stacks: TechnologyStack;
}

export function UnassignedTeams() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
            name,
            icon_url
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
      toast({
        title: "Success",
        description: "Mentor assigned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["unassigned-teams"] });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No eligible mentor found",
      });
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {team.technology_stacks?.icon_url ? (
                      <img 
                        src={team.technology_stacks.icon_url} 
                        alt={team.technology_stacks.name}
                        className="w-4 h-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const icon = document.createElement('div');
                            icon.className = 'w-4 h-4';
                            parent.appendChild(icon);
                            const codeIcon = document.createElement('span');
                            codeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>';
                            parent.appendChild(codeIcon);
                          }
                        }}
                      />
                    ) : (
                      <Code className="w-4 h-4" />
                    )}
                    <span>{team.technology_stacks?.name}</span>
                    <span>•</span>
                    <span>{team.team_members[0]?.count} members</span>
                  </div>
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