import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { profileSchema, type ProfileFormValues } from "@/hooks/useMentorProfile";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { AvatarField } from "./fields/AvatarField";
import { SocialProfileFields } from "./fields/SocialProfileFields";
import { useState } from "react";

interface MentorProfileFormProps {
  defaultValues: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
  isSubmitting: boolean;
}

interface ValidationState {
  isGithubValid: boolean;
  isLinkedInValid: boolean;
}

export function MentorProfileForm({ defaultValues, onSubmit, isSubmitting }: MentorProfileFormProps) {
  const [validationState, setValidationState] = useState<ValidationState>({
    isGithubValid: false,
    isLinkedInValid: false,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    onSubmit(values);
  };

  const isFormValid = validationState.isGithubValid && validationState.isLinkedInValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <AvatarField form={form} />
        <SocialProfileFields 
          form={form} 
          onValidationChange={setValidationState}
          validationState={validationState}
        />

        <Button 
          type="submit"
          disabled={isSubmitting || !isFormValid}
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