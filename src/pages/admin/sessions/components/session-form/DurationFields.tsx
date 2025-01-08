import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SessionFormValues } from "../../types/session-form";

interface DurationFieldsProps {
  form: UseFormReturn<SessionFormValues>;
}

export function DurationFields({ form }: DurationFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={15} 
                step={15} 
                {...field}
                onChange={e => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="max_slots_per_mentor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Slots per Mentor</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                {...field}
                onChange={e => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}