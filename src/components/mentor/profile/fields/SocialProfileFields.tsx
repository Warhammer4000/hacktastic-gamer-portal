import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";
import { validateProfiles } from "@/utils/profileValidation";

interface SocialProfileFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function SocialProfileFields({ form }: SocialProfileFieldsProps) {
  const [isValidatingGithub, setIsValidatingGithub] = useState(false);
  const [isValidatingLinkedin, setIsValidatingLinkedin] = useState(false);

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
    <>
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
    </>
  );
}