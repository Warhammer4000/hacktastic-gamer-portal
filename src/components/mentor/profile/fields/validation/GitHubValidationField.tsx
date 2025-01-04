import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";
import { validateProfiles } from "@/utils/profileValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GitHubValidationFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

interface ValidationState {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
}

export function GitHubValidationField({ form }: GitHubValidationFieldProps) {
  const [validation, setValidation] = useState<ValidationState>({
    isValidating: false,
    isValid: false,
    error: null,
  });

  const validateGithub = async () => {
    const githubUsername = form.getValues('github_username')?.trim();
    if (!githubUsername) return;

    setValidation({ isValidating: true, isValid: false, error: null });
    try {
      const isValid = await validateProfiles({ ...form.getValues(), github_username: githubUsername });
      setValidation({ 
        isValidating: false, 
        isValid: isValid, 
        error: isValid ? null : "Invalid GitHub username" 
      });
    } catch (error) {
      setValidation({ 
        isValidating: false, 
        isValid: false, 
        error: "Failed to validate GitHub username" 
      });
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
                  disabled={validation.isValid}
                  className={validation.isValid ? "bg-muted" : ""}
                />
              </FormControl>
              <FormMessage />
              {validation.error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{validation.error}</AlertDescription>
                </Alert>
              )}
            </div>
            <Button
              type="button"
              variant={validation.isValid ? "default" : "outline"}
              onClick={validateGithub}
              disabled={validation.isValidating || !field.value?.trim() || validation.isValid}
              className="shrink-0"
            >
              {validation.isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating
                </>
              ) : validation.isValid ? (
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
  );
}