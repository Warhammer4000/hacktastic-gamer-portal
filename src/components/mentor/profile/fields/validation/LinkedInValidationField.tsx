import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";
import { validateProfiles } from "@/utils/profileValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LinkedInValidationFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

interface ValidationState {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
}

export function LinkedInValidationField({ form }: LinkedInValidationFieldProps) {
  const [validation, setValidation] = useState<ValidationState>({
    isValidating: false,
    isValid: false,
    error: null,
  });

  const validateLinkedin = async () => {
    const linkedinId = form.getValues('linkedin_profile_id')?.trim();
    if (!linkedinId) return;

    setValidation({ isValidating: true, isValid: false, error: null });
    try {
      const isValid = await validateProfiles({ ...form.getValues(), linkedin_profile_id: linkedinId });
      setValidation({ 
        isValidating: false, 
        isValid: isValid, 
        error: isValid ? null : "Invalid LinkedIn profile ID" 
      });
    } catch (error) {
      setValidation({ 
        isValidating: false, 
        isValid: false, 
        error: "Failed to validate LinkedIn profile ID" 
      });
    }
  };

  return (
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
              onClick={validateLinkedin}
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
                'Validate LinkedIn'
              )}
            </Button>
          </div>
        </FormItem>
      )}
    />
  );
}