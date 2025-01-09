import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { TimeSlotManager } from "../TimeSlotManager";
import { UseFormReturn } from "react-hook-form";
import { SessionFormValues } from "../../types/session-form";

interface TimeSlotFieldProps {
  form: UseFormReturn<SessionFormValues>;
}

export function TimeSlotField({ form }: TimeSlotFieldProps) {
  return (
    <FormField
      control={form.control}
      name="time_slots"
      render={({ field }) => {
        // Initialize slots for all days if not already set
        const initializedSlots = field.value?.map(slot => ({
          day: slot.day,
          slotIndex: slot.slotIndex,
          startTime: slot.startTime,
          endTime: slot.endTime
        })) || Array.from({ length: 7 }, (_, i) => ({
          day: i,
          slotIndex: 0,  // Initialize with default slot index
          startTime: null,
          endTime: null
        }));

        return (
          <FormItem>
            <FormLabel>Available Time Slots</FormLabel>
            <FormControl>
              <TimeSlotManager 
                value={initializedSlots}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}