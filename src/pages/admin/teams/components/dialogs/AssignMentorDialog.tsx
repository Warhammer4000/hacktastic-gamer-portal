import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/participant/teams/components/SearchInput";
import { MentorList } from "./mentor-assignment/MentorList";
import { DialogFooter } from "./mentor-assignment/DialogFooter";
import { useMentorAssignment } from "./mentor-assignment/useMentorAssignment";

interface AssignMentorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamId: string;
  teamTechStackId: string | null;
  currentMentorId?: string | null;
  onConfirm: () => void;
}

export function AssignMentorDialog({
  isOpen,
  onOpenChange,
  teamName,
  teamId,
  teamTechStackId,
  currentMentorId,
  onConfirm,
}: AssignMentorDialogProps) {
  const {
    mentors,
    isLoading,
    search,
    setSearch,
    selectedMentorId,
    setSelectedMentorId,
    isAssigning,
    handleAutoAssign,
    handleManualAssign,
  } = useMentorAssignment(teamId, teamTechStackId);

  const handleConfirm = async (assignFn: () => Promise<boolean>) => {
    const success = await assignFn();
    if (success) {
      onConfirm();
      onOpenChange(false);
    }
  };

  const title = currentMentorId ? "Reassign Mentor" : "Assign Mentor";
  const description = currentMentorId 
    ? `Choose a new mentor for team "${teamName}" or let the system auto-assign one based on tech stack and availability.`
    : `Choose a mentor for team "${teamName}" or let the system auto-assign one based on tech stack and availability.`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search mentors..."
            className="w-full"
          />

          <MentorList
            mentors={mentors}
            isLoading={isLoading}
            selectedMentorId={selectedMentorId}
            onMentorSelect={setSelectedMentorId}
          />
        </div>

        <DialogFooter
          onClose={() => onOpenChange(false)}
          onAutoAssign={() => handleConfirm(handleAutoAssign)}
          onManualAssign={() => handleConfirm(handleManualAssign)}
          isAssigning={isAssigning}
          hasSelectedMentor={!!selectedMentorId}
        />
      </DialogContent>
    </Dialog>
  );
}