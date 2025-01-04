import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";
import { LinkedInValidationField } from "./validation/LinkedInValidationField";
import { GitHubValidationField } from "./validation/GitHubValidationField";

interface SocialProfileFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function SocialProfileFields({ form }: SocialProfileFieldsProps) {
  return (
    <>
      <LinkedInValidationField form={form} />
      <GitHubValidationField form={form} />
    </>
  );
}