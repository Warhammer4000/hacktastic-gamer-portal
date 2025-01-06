import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Github, CheckCircle2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { validateProfiles } from "@/utils/profileValidation";
import { ProfileFormValues } from "../schema";
import { cn } from "@/lib/utils";

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
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Github className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      {...field} 
                      disabled={isGithubValid}
                      className={cn("pl-10", isGithubValid && "bg-muted")}
                      placeholder="Your GitHub username"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </div>
              <Button
                type="button"
                variant={isGithubValid ? "outline" : "default"}
                onClick={validateGithub}
                disabled={isValidating || !field.value?.trim() || isGithubValid}
                className="min-w-32"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating
                  </>
                ) : isGithubValid ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Validated
                  </>
                ) : (
                  'Validate GitHub'
                )}
              </Button>
            </div>

            {validationError && (
              <Alert variant="destructive">
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {isGithubValid && (
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <AlertDescription className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  GitHub username validated successfully!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}