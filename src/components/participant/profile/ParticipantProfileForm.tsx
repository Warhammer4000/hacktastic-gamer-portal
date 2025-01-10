import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Github, Loader2, Save, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AvatarUrlField } from "./fields/AvatarUrlField";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { GitHubUsernameField } from "./fields/GitHubUsernameField";
import { profileSchema, type ProfileFormValues } from "./schema";

interface ParticipantProfileFormProps {
  profile: ProfileFormValues;
  onSuccess?: () => void;
}

export function ParticipantProfileForm({ profile, onSuccess }: ParticipantProfileFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: profile.id,
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
        .eq('id', values.id);

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
        <div className="relative px-6">
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