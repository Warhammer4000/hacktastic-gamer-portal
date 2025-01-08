import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { TimeSlotManager } from "../TimeSlotManager";
import { UseFormReturn } from "react-hook-form";
import { SessionFormValues, TimeSlot } from "../../types/session-form";

interface TimeSlotFieldProps {
  form: UseFormReturn<SessionFormValues>;
}

export function TimeSlotField({ form }: TimeSlotFieldProps) {
  return (
    <FormField
      control={form.control}
      name="time_slots"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Available Time Slots</FormLabel>
          <FormControl>
            <TimeSlotManager 
              value={field.value} 
              onChange={(slots: TimeSlot[]) => field.onChange(slots)} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}