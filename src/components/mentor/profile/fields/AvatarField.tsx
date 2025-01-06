import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
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
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={field.value || undefined} alt="Profile picture" />
                <AvatarFallback className="text-xl">
                  {form.getValues("full_name")?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <Button 
                type="button" 
                size="icon" 
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full max-w-md">
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter avatar URL" 
                  className="text-center"
                />
              </FormControl>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}