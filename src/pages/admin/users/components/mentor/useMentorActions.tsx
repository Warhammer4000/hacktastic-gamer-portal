import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMentorActions() {
  const queryClient = useQueryClient();

  const deleteMentor = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .rpc('delete_user_cascade', {
          user_id: userId
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
    },
    onError: (error: Error) => {
      console.error('Error removing mentor:', error);
      toast.error(`Failed to remove mentor: ${error.message}`);
    },
  });

  return {
    deleteMentor,
  };
}