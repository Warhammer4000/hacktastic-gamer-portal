import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues, roleOptions } from "../../types/event-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface EventFormFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventFormFields({ form }: EventFormFieldsProps) {
  const { data: techStacks } = useQuery({
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
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Event title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Event description"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tech_stacks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technology Stacks</FormLabel>
            <FormControl>
              <MultiSelect
                options={techStacks || []}
                placeholder="Select technology stacks"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roles"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Roles</FormLabel>
            <FormControl>
              <MultiSelect
                options={roleOptions}
                placeholder="Select roles"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isPublic"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Public Event</FormLabel>
              <p className="text-sm text-muted-foreground">
                Make this event visible to everyone
              </p>
            </div>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP p")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                      <div className="ml-auto flex space-x-2">
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                        <Clock className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </FormControl>
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
                  />
                  <div className="border-t p-3">
                    <Input
                      type="time"
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
                </PopoverContent>
              </Popover>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP p")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                      <div className="ml-auto flex space-x-2">
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                        <Clock className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </FormControl>
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
                  />
                  <div className="border-t p-3">
                    <Input
                      type="time"
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
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}