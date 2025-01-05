import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechStackFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export function TechStackField({ form }: TechStackFieldProps) {
  const { data: techStacks = [] } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("id, name, icon_url")
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const selectedStacks = form.watch("tech_stacks") || [];

  return (
    <FormField
      control={form.control}
      name="tech_stacks"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Technology Stacks</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="p-2 border rounded-lg">
                <div className="text-sm text-gray-500 mb-2">
                  {selectedStacks.length} Selected
                </div>
                <div className="space-y-1">
                  {techStacks.map((stack) => (
                    <div
                      key={stack.id}
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors",
                        selectedStacks.includes(stack.id) && "bg-green-50"
                      )}
                      onClick={() => {
                        const newValue = selectedStacks.includes(stack.id)
                          ? selectedStacks.filter((id) => id !== stack.id)
                          : [...selectedStacks, stack.id];
                        field.onChange(newValue);
                      }}
                    >
                      <div className="flex items-center justify-center w-5 h-5">
                        {selectedStacks.includes(stack.id) ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border rounded" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {stack.icon_url ? (
                          <img
                            src={stack.icon_url}
                            alt={stack.name}
                            className="w-4 h-4"
                          />
                        ) : (
                          <Code className="w-4 h-4" />
                        )}
                        <span>{stack.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}