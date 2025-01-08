import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { SessionFormValues } from "../../types/session-form";

interface TechStackFieldProps {
  form: UseFormReturn<SessionFormValues>;
}

export function TechStackField({ form }: TechStackFieldProps) {
  const { data: techStacks = [] } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="tech_stack_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Technology Stack (Optional)</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a technology stack" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {techStacks.map((stack) => (
                <SelectItem key={stack.id} value={stack.id}>
                  {stack.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}