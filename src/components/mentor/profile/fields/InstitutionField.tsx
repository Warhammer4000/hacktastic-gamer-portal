import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/hooks/useMentorProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, Building2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InstitutionFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function InstitutionField({ form }: InstitutionFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: institutions, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name')
        .eq('type', 'organization')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredInstitutions = institutions?.filter(institution =>
    institution.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedInstitution = institutions?.find(
    institution => institution.id === form.getValues("institution_id")
  );

  return (
    <FormField
      control={form.control}
      name="institution_id"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel>Organization</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {selectedInstitution && (
                <Card className="p-3 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">{selectedInstitution.name}</span>
                  </div>
                </Card>
              )}

              <Card className="relative">
                <ScrollArea className="h-[200px] rounded-md">
                  {isLoading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Loading organizations...
                    </div>
                  ) : filteredInstitutions?.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No organizations found
                    </div>
                  ) : (
                    <div className="p-2">
                      {filteredInstitutions?.map((institution) => (
                        <button
                          key={institution.id}
                          type="button"
                          onClick={() => form.setValue("institution_id", institution.id)}
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                            field.value === institution.id && "bg-primary/10 text-primary"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {institution.name}
                          </div>
                          {field.value === institution.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}