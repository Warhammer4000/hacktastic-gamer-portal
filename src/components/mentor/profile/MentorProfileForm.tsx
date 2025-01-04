import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profileSchema, type ProfileFormValues } from "@/hooks/useMentorProfile";
import { validateProfiles } from "@/utils/profileValidation";

interface MentorProfileFormProps {
  defaultValues: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
  isSubmitting: boolean;
}

export function MentorProfileForm({ defaultValues, onSubmit, isSubmitting }: MentorProfileFormProps) {
  const [isValidating, setIsValidating] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    const isValid = await validateProfiles(values);
    if (isValid) {
      onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Photo URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin_profile_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="john-doe-123" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="github_username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => validateProfiles(form.getValues())}
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating
              </>
            ) : (
              'Validate Profiles'
            )}
          </Button>

          <Button 
            type="submit"
            disabled={isSubmitting || isValidating}
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
        </div>
      </form>
    </Form>
  );
}