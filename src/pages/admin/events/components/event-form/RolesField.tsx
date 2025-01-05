import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";

interface RolesFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export function RolesField({ form }: RolesFieldProps) {
  const roles = form.watch("roles");

  const toggleRole = (role: "mentor" | "participant") => {
    const currentRoles = new Set(roles);
    if (currentRoles.has(role)) {
      currentRoles.delete(role);
    } else {
      currentRoles.add(role);
    }
    form.setValue("roles", Array.from(currentRoles));
  };

  return (
    <>
      <FormField
        control={form.control}
        name="roles"
        render={() => (
          <FormItem>
            <FormLabel>Roles</FormLabel>
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mentor"
                  checked={roles?.includes("mentor")}
                  onCheckedChange={() => toggleRole("mentor")}
                />
                <label
                  htmlFor="mentor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mentor
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="participant"
                  checked={roles?.includes("participant")}
                  onCheckedChange={() => toggleRole("participant")}
                />
                <label
                  htmlFor="participant"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Participant
                </label>
              </div>
            </div>
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