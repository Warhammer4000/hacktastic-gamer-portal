import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useParticipantActions() {
  const queryClient = useQueryClient();

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
    },
    onError: (error: Error) => {
      console.error('Error removing participant:', error);
      toast.error(`Failed to remove participant: ${error.message}`);
    },
  });

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      deleteParticipant.mutate(userId);
    }
  };

  return { handleDelete };
}