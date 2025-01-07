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

interface ReassignMentorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  onConfirm: () => void;
}

export function ReassignMentorDialog({
  isOpen,
  onOpenChange,
  teamName,
  onConfirm,
}: ReassignMentorDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
          <AlertDialogAction onClick={onConfirm}>
            Reassign Mentor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}