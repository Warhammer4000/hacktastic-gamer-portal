import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateTeamDialog } from "@/components/participant/teams/CreateTeamDialog";
import { JoinTeamDialog } from "@/components/participant/teams/JoinTeamDialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Team {
  id: string;
  name: string;
  join_code: string;
  status: string;
  mentor_id: string | null;
  repository_url: string | null;
  description: string | null;
  tech_stack: {
    name: string;
    icon_url: string;
  } | null;
}

export default function TeamPage() {
  const [isViewTeamOpen, setIsViewTeamOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: team, isLoading } = useQuery({
    queryKey: ['participant-team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teamMember, error: teamMemberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (teamMemberError || !teamMember) return null;

      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          join_code,
          status,
          mentor_id,
          repository_url,
          description,
          tech_stack:tech_stack_id (
            name,
            icon_url
          )
        `)
        .eq('id', teamMember.team_id)
        .single();

      if (teamError) return null;
      return team;
    },
  });

  const handleDeleteTeam = async () => {
    if (!team) return;

    // Only allow deletion if team is not locked
    if (team.status === 'locked') {
      toast.error("Cannot delete a locked team");
      return;
    }

    try {
      // Delete team members first
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id);

      if (membersError) throw membersError;

      // Then delete the team
      const { error: teamError } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);

      if (teamError) throw teamError;

      toast.success("Team deleted successfully");
      navigate(0); // Refresh the page
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error("Failed to delete team");
    }
  };

  if (isLoading) {
    return (
      <div className="container p-6">
        <h1 className="text-3xl font-bold mb-8">Team</h1>
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
        <h1 className="text-3xl font-bold mb-8">Team</h1>
        
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
      <h1 className="text-3xl font-bold mb-8">Team</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{team.name}</p>
              {team.description && (
                <p className="text-sm text-muted-foreground">
                  {team.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Status: {team.status}
              </p>
              {team.tech_stack && (
                <p className="text-sm text-muted-foreground">
                  Tech Stack: {team.tech_stack.name}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setIsViewTeamOpen(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  View Team
                </Button>
                {team.status !== 'locked' && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Team
                  </Button>
                )}
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

      <Dialog open={isViewTeamOpen} onOpenChange={setIsViewTeamOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{team.name}</DialogTitle>
            {team.description && (
              <DialogDescription>
                {team.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Team Details</h4>
              <p className="text-sm text-muted-foreground">Status: {team.status}</p>
              {team.tech_stack && (
                <p className="text-sm text-muted-foreground">
                  Tech Stack: {team.tech_stack.name}
                </p>
              )}
              {team.repository_url && (
                <p className="text-sm text-muted-foreground">
                  Repository: <a href={team.repository_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View on GitHub</a>
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your team
              and remove all team members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam}>Delete Team</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}