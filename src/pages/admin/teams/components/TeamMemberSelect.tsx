import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
  participants = [], // Provide default empty array
  isLoading 
}: TeamMemberSelectProps) {
  const [open, setOpen] = useState(false);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            participants.find((participant) => participant.id === value)?.full_name || 
            participants.find((participant) => participant.id === value)?.email ||
            "Select participant..."
          ) : (
            "Select participant..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search participants..." />
          <CommandEmpty>No participant found.</CommandEmpty>
          <CommandGroup>
            {participants.map((participant) => (
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
                {participant.full_name || participant.email}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}