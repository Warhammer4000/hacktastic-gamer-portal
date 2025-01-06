import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface InstitutionFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function InstitutionField({ form }: InstitutionFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredInstitutions = institutions?.filter(institution =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name="institution_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Institution</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="Search institutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              <ScrollArea className="h-[200px] border rounded-md bg-background">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading institutions...
                  </div>
                ) : filteredInstitutions?.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No institutions found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 p-2 gap-1">
                    {filteredInstitutions?.map((institution) => (
                      <button
                        key={institution.id}
                        type="button"
                        onClick={() => form.setValue("institution_id", institution.id)}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                          field.value === institution.id && "bg-accent text-accent-foreground"
                        )}
                      >
                        {institution.name}
                        {field.value === institution.id && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}