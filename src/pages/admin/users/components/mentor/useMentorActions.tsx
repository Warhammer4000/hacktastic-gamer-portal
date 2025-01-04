import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useMentorActions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editingMentorId, setEditingMentorId] = useState<string | null>(null);

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
    // Navigate to mentor profile edit page
    navigate(`/admin/mentors/edit/${mentorId}`);
  };

  const handleDelete = (mentorId: string) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      deleteMentor.mutate(mentorId);
    }
  };

  return {
    handleEdit,
    handleDelete,
    editingMentorId,
  };
}