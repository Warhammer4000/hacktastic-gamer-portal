import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  avatar_url: z.string().url("Must be a valid URL"),
  linkedin_profile_id: z.string().min(1, "LinkedIn profile ID is required"),
  github_username: z.string().min(1, "GitHub username is required"),
  email: z.string().email("Invalid email address"),
});

export default function MentorProfile() {
  const [isValidating, setIsValidating] = useState(false);
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

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      avatar_url: profile?.avatar_url || "",
      linkedin_profile_id: profile?.linkedin_profile_id || "",
      github_username: profile?.github_username || "",
      email: profile?.email || "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (values: z.infer<typeof profileSchema>) => {
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

  const validateProfiles = async (values: z.infer<typeof profileSchema>) => {
    setIsValidating(true);
    try {
      // Validate GitHub username
      const githubResponse = await fetch(`https://api.github.com/users/${values.github_username}`);
      if (!githubResponse.ok) {
        toast.error("Invalid GitHub username");
        return false;
      }

      // Validate LinkedIn profile ID (basic format validation)
      const linkedinRegex = /^[a-zA-Z0-9-]+$/;
      if (!linkedinRegex.test(values.linkedin_profile_id)) {
        toast.error("Invalid LinkedIn profile ID format");
        return false;
      }

      toast.success("Profile validation successful");
      return true;
    } catch (error) {
      toast.error("Validation failed");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const isValid = await validateProfiles(values);
    if (isValid) {
      updateProfile.mutate(values);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Mentor Profile</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_profile_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="john-doe-123" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => validateProfiles(form.getValues())}
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating
                </>
              ) : (
                'Validate Profiles'
              )}
            </Button>

            <Button 
              type="submit"
              disabled={updateProfile.isPending || isValidating}
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
          </div>
        </form>
      </Form>

      {!profile?.is_profile_approved && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            Your profile is pending approval from an administrator.
          </p>
        </div>
      )}
    </div>
  );
}