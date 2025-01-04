import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { validateProfiles } from "@/utils/profileValidation";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_username: z.string().min(1, "GitHub username is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ParticipantProfile() {
  const queryClient = useQueryClient();
  const [isGithubValid, setIsGithubValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['participant-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return profile;
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      avatar_url: profile?.avatar_url || "",
      github_username: profile?.github_username || "",
    },
  });

  const validateGithub = async () => {
    const githubUsername = form.getValues('github_username')?.trim();
    if (!githubUsername) return;

    setIsValidating(true);
    setValidationError(null);
    
    try {
      const isValid = await validateProfiles({ ...form.getValues(), github_username: githubUsername });
      setIsGithubValid(isValid);
      if (!isValid) {
        setValidationError("Invalid GitHub username");
      }
    } catch (error) {
      setValidationError("Failed to validate GitHub username");
      setIsGithubValid(false);
    } finally {
      setIsValidating(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))} className="space-y-6">
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
                <FormLabel>Avatar URL</FormLabel>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                  {field.value && (
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={field.value} alt="Profile preview" />
                      <AvatarFallback>
                        {form.getValues("full_name")?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Username</FormLabel>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={isGithubValid}
                        className={isGithubValid ? "bg-muted" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                    {validationError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{validationError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant={isGithubValid ? "default" : "outline"}
                    onClick={validateGithub}
                    disabled={isValidating || !field.value?.trim() || isGithubValid}
                    className="shrink-0"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validating
                      </>
                    ) : isGithubValid ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" />
                        Validated
                      </>
                    ) : (
                      'Validate GitHub'
                    )}
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={updateProfile.isPending || !isGithubValid}
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
    </div>
  );
}