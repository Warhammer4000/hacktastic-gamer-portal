import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileSchema, type ProfileFormValues } from "@/hooks/useMentorProfile";
import { validateProfiles } from "@/utils/profileValidation";

interface MentorProfileFormProps {
  defaultValues: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
  isSubmitting: boolean;
}

export function MentorProfileForm({ defaultValues, onSubmit, isSubmitting }: MentorProfileFormProps) {
  const [isValidatingGithub, setIsValidatingGithub] = useState(false);
  const [isValidatingLinkedin, setIsValidatingLinkedin] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    onSubmit(values);
  };

  const validateGithub = async () => {
    const githubUsername = form.getValues('github_username')?.trim();
    if (!githubUsername) return;

    setIsValidatingGithub(true);
    try {
      await validateProfiles({ ...form.getValues(), github_username: githubUsername });
    } finally {
      setIsValidatingGithub(false);
    }
  };

  const validateLinkedin = async () => {
    const linkedinId = form.getValues('linkedin_profile_id')?.trim();
    if (!linkedinId) return;

    setIsValidatingLinkedin(true);
    try {
      await validateProfiles({ ...form.getValues(), linkedin_profile_id: linkedinId });
    } finally {
      setIsValidatingLinkedin(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
          name="linkedin_profile_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile ID</FormLabel>
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder="john-doe-123" />
                  </FormControl>
                  <FormMessage />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={validateLinkedin}
                  disabled={isValidatingLinkedin || !field.value?.trim()}
                  className="shrink-0"
                >
                  {isValidatingLinkedin ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating
                    </>
                  ) : (
                    'Validate LinkedIn'
                  )}
                </Button>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={validateGithub}
                  disabled={isValidatingGithub || !field.value?.trim()}
                  className="shrink-0"
                >
                  {isValidatingGithub ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating
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
          disabled={isSubmitting || isValidatingGithub || isValidatingLinkedin}
          className="w-full"
        >
          {isSubmitting ? (
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