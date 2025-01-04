import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";
import { validateProfiles } from "@/utils/profileValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SocialProfileFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

interface ValidationState {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
}

export function SocialProfileFields({ form }: SocialProfileFieldsProps) {
  const [githubValidation, setGithubValidation] = useState<ValidationState>({
    isValidating: false,
    isValid: false,
    error: null,
  });
  const [linkedinValidation, setLinkedinValidation] = useState<ValidationState>({
    isValidating: false,
    isValid: false,
    error: null,
  });

  const validateGithub = async () => {
    const githubUsername = form.getValues('github_username')?.trim();
    if (!githubUsername) return;

    setGithubValidation({ isValidating: true, isValid: false, error: null });
    try {
      const isValid = await validateProfiles({ ...form.getValues(), github_username: githubUsername });
      setGithubValidation({ 
        isValidating: false, 
        isValid: isValid, 
        error: isValid ? null : "Invalid GitHub username" 
      });
    } catch (error) {
      setGithubValidation({ 
        isValidating: false, 
        isValid: false, 
        error: "Failed to validate GitHub username" 
      });
    }
  };

  const validateLinkedin = async () => {
    const linkedinId = form.getValues('linkedin_profile_id')?.trim();
    if (!linkedinId) return;

    setLinkedinValidation({ isValidating: true, isValid: false, error: null });
    try {
      const isValid = await validateProfiles({ ...form.getValues(), linkedin_profile_id: linkedinId });
      setLinkedinValidation({ 
        isValidating: false, 
        isValid: isValid, 
        error: isValid ? null : "Invalid LinkedIn profile ID" 
      });
    } catch (error) {
      setLinkedinValidation({ 
        isValidating: false, 
        isValid: false, 
        error: "Failed to validate LinkedIn profile ID" 
      });
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
                  <Input 
                    {...field} 
                    placeholder="john-doe-123" 
                    disabled={linkedinValidation.isValid}
                    className={linkedinValidation.isValid ? "bg-muted" : ""}
                  />
                </FormControl>
                <FormMessage />
                {linkedinValidation.error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{linkedinValidation.error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button
                type="button"
                variant={linkedinValidation.isValid ? "default" : "outline"}
                onClick={validateLinkedin}
                disabled={linkedinValidation.isValidating || !field.value?.trim() || linkedinValidation.isValid}
                className="shrink-0"
              >
                {linkedinValidation.isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating
                  </>
                ) : linkedinValidation.isValid ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Validated
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
                  <Input 
                    {...field} 
                    disabled={githubValidation.isValid}
                    className={githubValidation.isValid ? "bg-muted" : ""}
                  />
                </FormControl>
                <FormMessage />
                {githubValidation.error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{githubValidation.error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button
                type="button"
                variant={githubValidation.isValid ? "default" : "outline"}
                onClick={validateGithub}
                disabled={githubValidation.isValidating || !field.value?.trim() || githubValidation.isValid}
                className="shrink-0"
              >
                {githubValidation.isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating
                  </>
                ) : githubValidation.isValid ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
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
    </>
  );
}