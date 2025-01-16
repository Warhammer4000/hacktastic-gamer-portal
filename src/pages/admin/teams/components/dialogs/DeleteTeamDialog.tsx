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
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamId: string;
}

export function DeleteTeamDialog({
  open,
  onOpenChange,
  teamName,
  teamId,
}: DeleteTeamDialogProps) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase.rpc('delete_team_cascade', {
        team_id_input: teamId
      });

      if (error) throw error;

      toast.success("Team deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error("Failed to delete team");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Team</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the team "{teamName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete Team
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}