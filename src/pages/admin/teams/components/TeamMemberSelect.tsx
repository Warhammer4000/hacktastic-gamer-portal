import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMemberSelectProps {
  onMemberSelect: (memberId: string) => void;
  excludeUserIds?: string[];
}

export function TeamMemberSelect({ onMemberSelect, excludeUserIds = [] }: TeamMemberSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { data: participants } = useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          user_roles!inner (role)
        `)
        .eq('user_roles.role', 'participant')
        .not('id', 'in', `(${excludeUserIds.join(',')})`)
        .order('full_name');

      if (error) throw error;
      return data;
    },
  });

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
    onMemberSelect(currentValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? participants?.find((p) => p.id === value)?.full_name : "Select participant..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search participants..." />
          <CommandEmpty>No participant found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {participants?.map((participant) => (
              <CommandItem
                key={participant.id}
                value={participant.id}
                onSelect={handleSelect}
                className="flex items-center gap-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={participant.avatar_url || ''} />
                  <AvatarFallback>{participant.full_name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">{participant.full_name || participant.email}</p>
                </div>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === participant.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}