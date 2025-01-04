import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { validateProfiles } from "@/utils/profileValidation";
import { ProfileFormValues } from "../schema";

interface GitHubUsernameFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function GitHubUsernameField({ form }: GitHubUsernameFieldProps) {
  const [isGithubValid, setIsGithubValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  return (
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
  );
}