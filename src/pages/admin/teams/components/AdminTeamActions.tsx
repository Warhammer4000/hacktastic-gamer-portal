import { useState } from "react";
import { MoreVertical, Trash2, UserPlus2, RefreshCw, Github, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteTeamDialog } from "./dialogs/DeleteTeamDialog";
import { AssignMentorDialog } from "./dialogs/mentor-assignment/AssignMentorDialog";
import { TeamRepositoryDialog } from "./dialogs/repository/TeamRepositoryDialog";
import { EditTeamDialog } from "./EditTeamDialog";
import { useQueryClient } from "@tanstack/react-query";

interface AdminTeamActionsProps {
  teamId: string;
  teamName: string;
  currentMentorId: string | null;
  teamTechStackId: string | null;
  repositoryUrl: string | null;
}

export function AdminTeamActions({ 
  teamId, 
  teamName, 
  currentMentorId,
  teamTechStackId,
  repositoryUrl
}: AdminTeamActionsProps) {
  const [dialogState, setDialogState] = useState<{
    delete: boolean;
    mentor: boolean;
    repository: boolean;
    edit: boolean;
  }>({
    delete: false,
    mentor: false,
    repository: false,
    edit: false,
  });

  const queryClient = useQueryClient();

  const closeAllDialogs = () => {
    setDialogState({
      delete: false,
      mentor: false,
      repository: false,
      edit: false,
    });
  };

  const openDialog = (dialog: keyof typeof dialogState) => {
    closeAllDialogs();
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const mentorActionText = currentMentorId ? "Reassign Mentor" : "Assign Mentor";
  const MentorActionIcon = currentMentorId ? RefreshCw : UserPlus2;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openDialog('edit')}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Team
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openDialog('delete')}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Team
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog('mentor')}>
            <MentorActionIcon className="mr-2 h-4 w-4" />
            {mentorActionText}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog('repository')}>
            <Github className="mr-2 h-4 w-4" />
            Manage Repository
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTeamDialog
        open={dialogState.delete}
        onOpenChange={(open) => setDialogState(prev => ({ ...prev, delete: open }))}
        teamName={teamName}
        teamId={teamId}
      />

      <AssignMentorDialog
        open={dialogState.mentor}
        onOpenChange={(open) => setDialogState(prev => ({ ...prev, mentor: open }))}
        onConfirm={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
        }}
        teamName={teamName}
        teamId={teamId}
        teamTechStackId={teamTechStackId}
        currentMentorId={currentMentorId}
      />

      <TeamRepositoryDialog
        open={dialogState.repository}
        onOpenChange={(open) => setDialogState(prev => ({ ...prev, repository: open }))}
        teamId={teamId}
        teamName={teamName}
        currentRepositoryUrl={repositoryUrl}
      />

      <EditTeamDialog
        open={dialogState.edit}
        onOpenChange={(open) => setDialogState(prev => ({ ...prev, edit: open }))}
        teamId={teamId}
      />
    </>
  );
}