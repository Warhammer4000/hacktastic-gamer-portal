import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, User, Github, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { AvatarUrlField } from "./fields/AvatarUrlField";
import { GitHubUsernameField } from "./fields/GitHubUsernameField";
import { profileSchema, type ProfileFormValues } from "./schema";
import { Card } from "@/components/ui/card";

interface ParticipantProfileFormProps {
  profile: ProfileFormValues;
  onSuccess?: () => void;
}

export function ParticipantProfileForm({ profile, onSuccess }: ParticipantProfileFormProps) {
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
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', profile.id);

      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success("Profile updated successfully");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))} className="space-y-8">
        <div className="relative -mt-16 px-6">
          <AvatarUrlField form={form} />
        </div>

        <div className="p-6 space-y-8">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <User className="h-5 w-5" />
              <h2>Basic Information</h2>
            </div>
            <BasicInfoFields form={form} />
          </Card>

          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Github className="h-5 w-5" />
              <h2>GitHub Integration</h2>
            </div>
            <GitHubUsernameField form={form} />
          </Card>

          <Button 
            type="submit" 
            size="lg"
            className="w-full"
            disabled={updateProfile.isPending || !form.getValues("github_username")}
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}