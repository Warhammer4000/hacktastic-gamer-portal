import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { profileSchema, type ProfileFormValues } from "@/hooks/useMentorProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AvatarField } from "./fields/AvatarField";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { SocialProfileFields } from "./fields/SocialProfileFields";

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
        <div className="relative px-6">
          <AvatarField form={form} />
        </div>
        
        <div className="p-6 space-y-8">
          <div className="space-y-6">
            <BasicInfoFields form={form} />
            <SocialProfileFields 
              form={form} 
              onValidationChange={setValidationState}
              validationState={validationState}
            />
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}