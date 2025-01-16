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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isRepositoryOpen, setIsRepositoryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const queryClient = useQueryClient();

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
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Team
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Team
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsMentorOpen(true)}>
            <MentorActionIcon className="mr-2 h-4 w-4" />
            {mentorActionText}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRepositoryOpen(true)}>
            <Github className="mr-2 h-4 w-4" />
            Manage Repository
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTeamDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        teamName={teamName}
        teamId={teamId}
      />

      <AssignMentorDialog
        open={isMentorOpen}
        onOpenChange={setIsMentorOpen}
        onConfirm={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
        }}
        teamName={teamName}
        teamId={teamId}
        teamTechStackId={teamTechStackId}
        currentMentorId={currentMentorId}
      />

      <TeamRepositoryDialog
        open={isRepositoryOpen}
        onOpenChange={setIsRepositoryOpen}
        teamId={teamId}
        teamName={teamName}
        currentRepositoryUrl={repositoryUrl}
      />

      <EditTeamDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        teamId={teamId}
      />
    </>
  );
}