import { useQuery } from "@tanstack/react-query";
import { Plus, Users, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTeamDialog } from "@/components/participant/teams/CreateTeamDialog";
import { toast } from "sonner";
import { JoinTeamDialog } from "@/components/participant/teams/JoinTeamDialog";

interface Team {
  id: string;
  name: string;
  join_code: string;
  status: string;
  mentor_id: string | null;
  repository_url: string | null;
  tech_stack: {
    name: string;
    icon_url: string;
  } | null;
}

export default function ParticipantDashboard() {
  const { data: team, isLoading } = useQuery({
    queryKey: ['participant-team'],
    queryFn: async () => {
      const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!teamMember) return null;

      const { data: team } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          join_code,
          status,
          mentor_id,
          repository_url,
          tech_stack:tech_stack_id (
            name,
            icon_url
          )
        `)
        .eq('id', teamMember.team_id)
        .single();

      return team;
    },
  });

  if (isLoading) {
    return (
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="animate-pulse">
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create a Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start your own team and invite others to join
              </p>
              <CreateTeamDialog />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join a Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join an existing team using their team code
              </p>
              <JoinTeamDialog />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{team.name}</p>
              <p className="text-sm text-muted-foreground">
                Status: {team.status}
              </p>
              {team.tech_stack && (
                <p className="text-sm text-muted-foreground">
                  Tech Stack: {team.tech_stack.name}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  View Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Code</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Share this code with others to join your team:</p>
            <code className="bg-muted px-2 py-1 rounded">{team.join_code}</code>
          </CardContent>
        </Card>

        {team.mentor_id ? (
          <Card>
            <CardHeader>
              <CardTitle>Team Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your team has been assigned a mentor
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A mentor will be assigned to your team soon
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}