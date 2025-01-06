import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InstitutionFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function InstitutionField({ form }: InstitutionFieldProps) {
  const [open, setOpen] = useState(false);

  const { data: institutions, isLoading } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name')
        .eq('type', 'university')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="institution_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Institution</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Loading institutions..."
                  ) : field.value ? (
                    institutions?.find((institution) => institution.id === field.value)
                      ?.name
                  ) : (
                    "Select institution"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search institution..." />
                <CommandEmpty>No institution found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {institutions?.map((institution) => (
                    <CommandItem
                      key={institution.id}
                      value={institution.name}
                      onSelect={() => {
                        form.setValue("institution_id", institution.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === institution.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {institution.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}