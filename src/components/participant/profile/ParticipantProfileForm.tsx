import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { AvatarUrlField } from "./fields/AvatarUrlField";
import { GitHubUsernameField } from "./fields/GitHubUsernameField";
import { profileSchema, type ProfileFormValues } from "./schema";

interface ParticipantProfileFormProps {
  profile: ProfileFormValues;
}

export function ParticipantProfileForm({ profile }: ParticipantProfileFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      avatar_url: profile?.avatar_url || "",
      github_username: profile?.github_username || "",
      institution_id: profile?.institution_id || "",
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
      queryClient.invalidateQueries({ queryKey: ['participant-profile'] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))} className="space-y-6">
        <BasicInfoFields form={form} />
        <AvatarUrlField form={form} />
        <GitHubUsernameField form={form} />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={updateProfile.isPending || !form.getValues("github_username")}
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </form>
    </Form>
  );
}