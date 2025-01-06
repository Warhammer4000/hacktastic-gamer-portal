import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useParticipantActions() {
  const queryClient = useQueryClient();

  const deleteParticipant = useMutation({
    mutationFn: async (userId: string) => {
      // First delete related records
      const deletions = [
        // Delete user roles
        supabase.from('user_roles').delete().eq('user_id', userId),
        // Delete levels
        supabase.from('levels').delete().eq('user_id', userId),
        // Delete team memberships
        supabase.from('team_members').delete().eq('user_id', userId),
        // Delete profile
        supabase.from('profiles').delete().eq('id', userId),
      ];

      // Execute all deletions
      const results = await Promise.all(deletions);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Failed to delete user data');
      }

      // Finally delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participant removed successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to remove participant');
      console.error('Error:', error);
    },
  });

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      deleteParticipant.mutate(userId);
    }
  };

  return { handleDelete };
}