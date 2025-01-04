import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";

interface AvatarFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function AvatarField({ form }: AvatarFieldProps) {
  return (
    <FormField
      control={form.control}
      name="avatar_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Photo URL</FormLabel>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </div>
            {field.value && (
              <Avatar className="h-16 w-16">
                <AvatarImage src={field.value} alt="Profile preview" />
                <AvatarFallback>
                  {form.getValues("full_name")?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}