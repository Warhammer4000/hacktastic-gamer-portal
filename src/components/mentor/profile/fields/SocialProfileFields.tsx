import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";
import { LinkedInValidationField } from "./validation/LinkedInValidationField";
import { GitHubValidationField } from "./validation/GitHubValidationField";

interface ValidationState {
  isGithubValid: boolean;
  isLinkedInValid: boolean;
}

interface SocialProfileFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  onValidationChange: (state: ValidationState) => void;
  validationState: ValidationState;
}

export function SocialProfileFields({ form, onValidationChange, validationState }: SocialProfileFieldsProps) {
  const handleGithubValidation = (isValid: boolean) => {
    onValidationChange({
      ...validationState,
      isGithubValid: isValid,
    });
  };

  const handleLinkedInValidation = (isValid: boolean) => {
    onValidationChange({
      ...validationState,
      isLinkedInValid: isValid,
    });
  };

  return (
    <>
      <LinkedInValidationField 
        form={form} 
        onValidationChange={handleLinkedInValidation}
      />
      <GitHubValidationField 
        form={form} 
        onValidationChange={handleGithubValidation}
      />
    </>
  );
}