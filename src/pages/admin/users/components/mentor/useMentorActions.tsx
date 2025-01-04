import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMentorActions() {
  const queryClient = useQueryClient();

  const deleteMentor = useMutation({
    mutationFn: async (mentorId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(mentorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
      toast.success('Mentor has been removed');
    },
    onError: (error) => {
      toast.error('Failed to remove mentor');
      console.error('Error:', error);
    },
  });

  const handleEdit = (mentorId: string) => {
    // Implement edit functionality
    console.log('Edit mentor:', mentorId);
  };

  const handleDelete = (mentorId: string) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      deleteMentor.mutate(mentorId);
    }
  };

  return {
    handleEdit,
    handleDelete,
  };
}