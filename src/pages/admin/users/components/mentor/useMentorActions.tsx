import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMentorActions() {
  const queryClient = useQueryClient();

  const deleteMentor = useMutation({
    mutationFn: async (userId: string) => {
      // Call our RPC function to delete all user data
      const { error: rpcError } = await supabase
        .rpc('delete_user_cascade', {
          user_id: userId
        });

      if (rpcError) {
        console.error('Error in delete_user_cascade:', rpcError);
        throw rpcError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
      toast.success('Mentor removed successfully');
    },
    onError: (error) => {
      console.error('Error removing mentor:', error);
      toast.error('Failed to remove mentor');
    },
  });

  return {
    deleteMentor,
  };
}