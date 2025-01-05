import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";
import { Checkbox } from "@/components/ui/checkbox";

interface RolesFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export function RolesField({ form }: RolesFieldProps) {
  const roles = [
    { id: "mentor", label: "Mentor" },
    { id: "participant", label: "Participant" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <FormLabel>Roles</FormLabel>
        <div className="flex flex-col space-y-2">
          {roles.map((role) => (
            <FormField
              key={role.id}
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(role.id as any)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), role.id]
                          : field.value?.filter((r) => r !== role.id) || [];
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <span>{role.label}</span>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <FormField
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <span>Public Event</span>
          </FormItem>
        )}
      />
    </div>
  );
}