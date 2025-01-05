import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";

interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function DateTimeFields({ form }: DateTimeFieldsProps) {
  // Generate next 30 days for the dropdown
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(startOfDay(new Date()), i);
    return {
      value: date.toISOString(),
      label: format(date, "PPP")
    };
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start_time"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Time</FormLabel>
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) => {
                  const currentValue = field.value ? new Date(field.value) : new Date();
                  const newDate = new Date(value);
                  newDate.setHours(currentValue.getHours());
                  newDate.setMinutes(currentValue.getMinutes());
                  field.onChange(newDate.toISOString());
                }}
                value={field.value ? startOfDay(new Date(field.value)).toISOString() : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 opacity-50" />
                <Input
                  type="time"
                  className="w-full"
                  value={field.value ? format(new Date(field.value), "HH:mm") : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const date = field.value ? new Date(field.value) : new Date();
                    date.setHours(parseInt(hours));
                    date.setMinutes(parseInt(minutes));
                    field.onChange(date.toISOString());
                  }}
                />
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end_time"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Time</FormLabel>
            <div className="flex flex-col gap-2">
              <Select
                onValueChange={(value) => {
                  const currentValue = field.value ? new Date(field.value) : new Date();
                  const newDate = new Date(value);
                  newDate.setHours(currentValue.getHours());
                  newDate.setMinutes(currentValue.getMinutes());
                  field.onChange(newDate.toISOString());
                }}
                value={field.value ? startOfDay(new Date(field.value)).toISOString() : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {dateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 opacity-50" />
                <Input
                  type="time"
                  className="w-full"
                  value={field.value ? format(new Date(field.value), "HH:mm") : ""}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const date = field.value ? new Date(field.value) : new Date();
                    date.setHours(parseInt(hours));
                    date.setMinutes(parseInt(minutes));
                    field.onChange(date.toISOString());
                  }}
                />
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}