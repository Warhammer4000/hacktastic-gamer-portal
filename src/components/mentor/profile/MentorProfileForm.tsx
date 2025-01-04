import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { profileSchema, type ProfileFormValues } from "@/hooks/useMentorProfile";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { AvatarField } from "./fields/AvatarField";
import { SocialProfileFields } from "./fields/SocialProfileFields";

interface MentorProfileFormProps {
  defaultValues: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
  isSubmitting: boolean;
}

export function MentorProfileForm({ defaultValues, onSubmit, isSubmitting }: MentorProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <AvatarField form={form} />
        <SocialProfileFields form={form} />

        <Button 
          type="submit"
          disabled={isSubmitting}
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