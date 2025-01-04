import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface GitHubSettingsForm {
  organization_name: string;
  participant_team_slug: string;
  mentor_team_slug: string;
  admin_team_slug: string;
  personal_access_token: string;
}

export function GitHubSettings() {
  const { toast } = useToast();
  const form = useForm<GitHubSettingsForm>();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["github-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("github_settings")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = async (data: GitHubSettingsForm) => {
    try {
      const { error } = await supabase
        .from("github_settings")
        .upsert(data)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "GitHub settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving GitHub settings:", error);
      toast({
        title: "Error",
        description: "Failed to save GitHub settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="organization_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="your-org-name" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                The name of your GitHub organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participant_team_slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participant Team Slug</FormLabel>
              <FormControl>
                <Input placeholder="participants" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                The team slug for participants in your GitHub organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mentor_team_slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mentor Team Slug</FormLabel>
              <FormControl>
                <Input placeholder="mentors" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                The team slug for mentors in your GitHub organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admin_team_slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Team Slug</FormLabel>
              <FormControl>
                <Input placeholder="admins" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                The team slug for admins in your GitHub organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personal_access_token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal Access Token</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="ghp_..."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                GitHub Personal Access Token with organization management permissions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save GitHub Settings</Button>
      </form>
    </Form>
  );
}