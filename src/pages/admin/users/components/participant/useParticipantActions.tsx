import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export function useParticipantActions() {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const deleteParticipant = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .rpc('delete_user_cascade', {
          input_user_id: userId
        });

      if (error) {
        console.error('Error in delete_user_cascade:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participant removed successfully');
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      console.error('Error removing participant:', error);
      toast.error(`Failed to remove participant: ${error.message}`);
    },
  });

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteParticipant.mutate(userToDelete);
    }
  };

  return { 
    handleDelete, 
    confirmDelete, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen,
    userToDelete 
  };
}