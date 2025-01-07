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

interface DeleteTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  isDeleting: boolean;
  onConfirm: () => void;
}

export function DeleteTeamDialog({
  isOpen,
  onOpenChange,
  teamName,
  isDeleting,
  onConfirm,
}: DeleteTeamDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Team"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}