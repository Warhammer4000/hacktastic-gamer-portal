import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TechStackFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export function TechStackField({ form }: TechStackFieldProps) {
  const { data: techStacks = [] } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("id, name")
        .eq("status", "active");

      if (error) throw error;
      return data.map(stack => ({
        value: stack.id,
        label: stack.name,
      }));
    },
  });

  return (
    <FormField
      control={form.control}
      name="tech_stacks"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Technology Stacks</FormLabel>
          <FormControl>
            <MultiSelect
              options={techStacks}
              placeholder="Select technology stacks"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}