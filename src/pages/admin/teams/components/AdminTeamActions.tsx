import { useState } from "react";
import { MoreVertical, Trash2, UserPlus2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminTeamActionsProps {
  teamId: string;
  teamName: string;
  currentMentorId: string | null;
}

export function AdminTeamActions({ teamId, teamName, currentMentorId }: AdminTeamActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignMentorDialogOpen, setIsAssignMentorDialogOpen] = useState(false);
  const [isReassignMentorDialogOpen, setIsReassignMentorDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteTeam = async () => {
    try {
      setIsDeleting(true);
      console.log('Starting team deletion process for team:', teamId);

      // First, delete the GitHub repository if it exists
      try {
        const { error: repoError } = await supabase.functions.invoke('delete-team-repository', {
          body: { teamId }
        });

        if (repoError) {
          console.error('Error deleting repository:', repoError);
          // Don't throw here, continue with team deletion even if repo deletion fails
        }
      } catch (repoError) {
        console.error('Repository deletion error:', repoError);
        // Continue with team deletion even if repo deletion fails
      }

      // Delete all team members
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId);

      if (membersError) {
        console.error('Error deleting team members:', membersError);
        throw new Error(`Failed to delete team members: ${membersError.message}`);
      }

      console.log('Successfully deleted team members');

      // Delete the team itself
      const { error: teamError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (teamError) {
        console.error('Error deleting team:', teamError);
        throw new Error(`Failed to delete team: ${teamError.message}`);
      }

      console.log('Successfully deleted team');
      toast.success("Team deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast.error(error instanceof Error ? error.message : "Failed to delete team");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAssignMentor = async () => {
    try {
      const { data: mentorId, error: mentorError } = await supabase
        .rpc('assign_mentor_to_team', { team_id: teamId });

      if (mentorError) throw mentorError;

      if (!mentorId) {
        toast.error(
          "No eligible mentors available. This could be because:" +
          "\n- No mentors match the team's tech stack" +
          "\n- Available mentors have reached their team limit"
        );
        return;
      }

      toast.success("Mentor assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
    } catch (error) {
      console.error('Error assigning mentor:', error);
      toast.error("Failed to assign mentor");
    } finally {
      setIsAssignMentorDialogOpen(false);
    }
  };

  const handleReassignMentor = async () => {
    try {
      // First, remove current mentor
      const { error: updateError } = await supabase
        .from('teams')
        .update({ mentor_id: null, status: 'locked' })
        .eq('id', teamId);

      if (updateError) throw updateError;

      // Then, assign new mentor
      const { data: mentorId, error: mentorError } = await supabase
        .rpc('assign_mentor_to_team', { team_id: teamId });

      if (mentorError) throw mentorError;

      if (!mentorId) {
        toast.error(
          "No eligible mentors available. This could be because:" +
          "\n- No mentors match the team's tech stack" +
          "\n- Available mentors have reached their team limit"
        );
        return;
      }

      toast.success("Mentor reassigned successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
    } catch (error) {
      console.error('Error reassigning mentor:', error);
      toast.error("Failed to reassign mentor");
    } finally {
      setIsReassignMentorDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Team
          </DropdownMenuItem>
          {!currentMentorId && (
            <DropdownMenuItem onClick={() => setIsAssignMentorDialogOpen(true)}>
              <UserPlus2 className="mr-2 h-4 w-4" />
              Assign Mentor
            </DropdownMenuItem>
          )}
          {currentMentorId && (
            <DropdownMenuItem onClick={() => setIsReassignMentorDialogOpen(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reassign Mentor
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the team "{teamName}"? This action cannot be undone.
              All team members will be removed, the GitHub repository will be deleted, and any associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Team"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Mentor Dialog */}
      <AlertDialog open={isAssignMentorDialogOpen} onOpenChange={setIsAssignMentorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Mentor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign a mentor to the team "{teamName}"?
              The system will automatically select an eligible mentor based on:
              - Tech stack matching
              - Current mentor workload
              - Mentor preferences
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAssignMentor}>
              Assign Mentor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reassign Mentor Dialog */}
      <AlertDialog open={isReassignMentorDialogOpen} onOpenChange={setIsReassignMentorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reassign Mentor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reassign a new mentor to the team "{teamName}"?
              This will remove the current mentor and assign a new one based on:
              - Tech stack matching
              - Current mentor workload
              - Mentor preferences
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReassignMentor}>
              Reassign Mentor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}