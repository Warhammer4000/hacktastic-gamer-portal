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

interface AssignMentorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  onConfirm: () => void;
}

export function AssignMentorDialog({
  isOpen,
  onOpenChange,
  teamName,
  onConfirm,
}: AssignMentorDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
          <AlertDialogAction onClick={onConfirm}>
            Assign Mentor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}