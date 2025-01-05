import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, User, Globe } from "lucide-react";

interface RolesFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export function RolesField({ form }: RolesFieldProps) {
  const roles = [
    { id: "mentor", label: "Mentor", icon: <User className="h-4 w-4" /> },
    { id: "participant", label: "Participant", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-4">
      <FormLabel>Roles</FormLabel>
      <div className="flex flex-row gap-6">
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
                <div className="flex items-center space-x-2">
                  {role.icon}
                  <span>{role.label}</span>
                </div>
              </FormItem>
            )}
          />
        ))}

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
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Public Event</span>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}