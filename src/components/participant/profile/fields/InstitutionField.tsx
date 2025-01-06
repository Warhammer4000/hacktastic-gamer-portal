import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstitutionFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function InstitutionField({ form }: InstitutionFieldProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: institutions, isLoading } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('type', 'university')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  if (!institutions) {
    return (
      <FormField
        control={form.control}
        name="institution_id"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Institution</FormLabel>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  const filteredInstitutions = searchQuery 
    ? institutions.filter(institution =>
        institution.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : institutions;

  const selectedInstitution = institutions.find(
    institution => institution.id === form.getValues("institution_id")
  );

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
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      {selectedInstitution?.name || "Select your institution"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search institution..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandEmpty>No institution found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {filteredInstitutions.map((institution) => (
                    <CommandItem
                      key={institution.id}
                      value={institution.name}
                      onSelect={() => {
                        form.setValue("institution_id", institution.id);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          institution.id === field.value
                            ? "opacity-100"
                            : "opacity-0"
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