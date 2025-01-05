import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { toast } from "sonner";
import type { Institution } from "@/integrations/supabase/types/tables/institutions";

interface DeleteInstitutionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution: Institution;
}

export function DeleteInstitution({
  open,
  onOpenChange,
  institution,
}: DeleteInstitutionProps) {
  const queryClient = useQueryClient();

  const deleteInstitution = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("institutions")
        .delete()
        .eq("id", institution.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      onOpenChange(false);
      toast.success("Institution deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete institution: " + error.message);
    },
  });

  const handleDelete = () => {
    deleteInstitution.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Institution</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {institution.name}? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}