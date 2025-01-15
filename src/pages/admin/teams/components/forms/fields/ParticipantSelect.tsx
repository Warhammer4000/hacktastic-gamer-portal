import { useState } from "react";
import { Check, ChevronsUpDown, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ParticipantSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  error?: boolean;
}

export function ParticipantSelect({ value, onValueChange, error }: ParticipantSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: participants, isLoading } = useQuery({
    queryKey: ["available-participants", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          user_roles!inner (role)
        `)
        .eq("user_roles.role", "participant")
        .not("id", "in", (
          supabase
            .from("team_members")
            .select("user_id")
        ))
        .order("full_name");

      if (searchQuery) {
        query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const selectedParticipant = participants?.find(p => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            error && "border-destructive",
            !value && "text-muted-foreground"
          )}
        >
          {value && selectedParticipant ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedParticipant.avatar_url || ""} />
                <AvatarFallback>
                  {selectedParticipant.full_name?.[0] || selectedParticipant.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">
                {selectedParticipant.full_name || selectedParticipant.email}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 opacity-50" />
              <span>Select team leader</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search participants..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading participants...
            </div>
          ) : participants?.length === 0 ? (
            <CommandEmpty>No participants found.</CommandEmpty>
          ) : (
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {participants?.map((participant) => (
                <CommandItem
                  key={participant.id}
                  value={participant.id}
                  onSelect={() => {
                    onValueChange(participant.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar_url || ""} />
                      <AvatarFallback>
                        {participant.full_name?.[0] || participant.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      {participant.full_name && (
                        <span className="font-medium">{participant.full_name}</span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {participant.email}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === participant.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}