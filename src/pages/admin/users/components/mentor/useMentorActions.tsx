import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export function useMentorActions() {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const deleteMentor = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
      toast.success('Mentor removed successfully');
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      console.error('Error removing mentor:', error);
      toast.error(`Failed to remove mentor: ${error.message}`);
    },
  });

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMentor.mutate(userToDelete);
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