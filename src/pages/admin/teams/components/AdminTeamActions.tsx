import { useState } from "react";
import { MoreVertical, Trash2, UserPlus2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteTeamDialog } from "./dialogs/DeleteTeamDialog";
import { AssignMentorDialog } from "./dialogs/AssignMentorDialog";
import { ReassignMentorDialog } from "./dialogs/ReassignMentorDialog";

interface AdminTeamActionsProps {
  teamId: string;
  teamName: string;
  currentMentorId: string | null;
  teamTechStackId: string | null;
}

export function AdminTeamActions({ 
  teamId, 
  teamName, 
  currentMentorId,
  teamTechStackId 
}: AdminTeamActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignMentorDialogOpen, setIsAssignMentorDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteTeam = async () => {
    try {
      setIsDeleting(true);
      console.log('Starting team deletion process for team:', teamId);

      // Get the repository URL before deleting the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('repository_url')
        .eq('id', teamId)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        throw new Error('Failed to fetch team details');
      }

      // First try to delete the team and its related records from the database
      const { data: success, error: dbError } = await supabase
        .rpc('delete_team_cascade', { team_id_input: teamId });

      if (dbError || !success) {
        console.error('Error deleting team from database:', dbError);
        throw new Error(dbError?.message || 'Failed to delete team from database');
      }

      console.log('Successfully deleted team from database');

      // Only try to delete the GitHub repository if database deletion was successful
      // and if the team had a repository URL
      if (team?.repository_url) {
        try {
          const { error: repoError } = await supabase.functions.invoke('delete-team-repository', {
            body: { 
              teamId,
              repositoryUrl: team.repository_url
            }
          });

          if (repoError) {
            console.error('Error deleting repository:', repoError);
            toast.error("Team deleted but failed to delete GitHub repository");
          }
        } catch (repoError) {
          console.error('Repository deletion error:', repoError);
          toast.error("Team deleted but failed to delete GitHub repository");
        }
      }

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

  const mentorActionText = currentMentorId ? "Reassign Mentor" : "Assign Mentor";
  const mentorActionIcon = currentMentorId ? RefreshCw : UserPlus2;

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
          <DropdownMenuItem onClick={() => setIsAssignMentorDialogOpen(true)}>
            <mentorActionIcon className="mr-2 h-4 w-4" />
            {mentorActionText}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTeamDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        teamName={teamName}
        isDeleting={isDeleting}
        onConfirm={handleDeleteTeam}
      />

      <AssignMentorDialog
        isOpen={isAssignMentorDialogOpen}
        onOpenChange={setIsAssignMentorDialogOpen}
        teamName={teamName}
        teamId={teamId}
        teamTechStackId={teamTechStackId}
        currentMentorId={currentMentorId}
        onConfirm={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
        }}
      />
    </>
  );
}
