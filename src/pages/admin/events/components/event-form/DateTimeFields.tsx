import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";

interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function DateTimeFields({ form }: DateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start_time"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Time</FormLabel>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const currentValue = field.value ? new Date(field.value) : new Date();
                        date.setHours(currentValue.getHours());
                        date.setMinutes(currentValue.getMinutes());
                        field.onChange(date.toISOString());
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const currentValue = field.value ? new Date(field.value) : new Date();
                        date.setHours(currentValue.getHours());
                        date.setMinutes(currentValue.getMinutes());
                        field.onChange(date.toISOString());
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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