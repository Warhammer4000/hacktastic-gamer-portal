import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as z from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  avatar_url: z.string().url("Must be a valid URL"),
  linkedin_profile_id: z.string().min(1, "LinkedIn profile ID is required"),
  github_username: z.string().min(1, "GitHub username is required"),
  email: z.string().email("Invalid email address"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function useMentorProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['mentor-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return profile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-profile'] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });

  return {
    profile,
    isLoading,
    updateProfile,
  };
}