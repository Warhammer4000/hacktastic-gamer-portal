import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
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

interface TeamMemberSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  participants: Array<{ id: string; full_name: string | null; email: string }>;
  isLoading?: boolean;
}

export function TeamMemberSelect({ 
  value, 
  onValueChange, 
  participants = [], 
  isLoading = false 
}: TeamMemberSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
        disabled
      >
        <span>Loading participants...</span>
      </Button>
    );
  }

  const getParticipantLabel = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    return participant?.full_name || participant?.email || "Unknown participant";
  };

  const filteredParticipants = participants.filter(participant => {
    const searchLower = searchQuery.toLowerCase();
    return (
      participant.full_name?.toLowerCase().includes(searchLower) ||
      participant.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {value ? getParticipantLabel(value) : "Search participants..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No participant found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {filteredParticipants.map((participant) => (
              <CommandItem
                key={participant.id}
                value={participant.id}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === participant.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  {participant.full_name && (
                    <span className="font-medium">{participant.full_name}</span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {participant.email}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}