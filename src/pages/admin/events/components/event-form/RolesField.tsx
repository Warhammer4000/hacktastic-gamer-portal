import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues, roleOptions } from "../../types/event-form";

interface RolesFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export function RolesField({ form }: RolesFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="roles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Roles</FormLabel>
            <FormControl>
              <MultiSelect
                options={roleOptions}
                placeholder="Select roles"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Public Event</FormLabel>
              <p className="text-sm text-muted-foreground">
                Make this event visible to everyone
              </p>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}