import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options?: Option[];
  selected?: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  creatable?: boolean;
};

export function MultiSelect({
  options = [], // Provide default empty array
  selected = [], // Provide default empty array
  onChange,
  placeholder = "Select options...",
  className,
  creatable = false,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Ensure we're working with arrays even if undefined is passed
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelected = Array.isArray(selected) ? selected : [];

  const handleUnselect = (option: string) => {
    onChange(safeSelected.filter((s) => s !== option));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && safeSelected.length > 0) {
          handleUnselect(safeSelected[safeSelected.length - 1]);
        }
      }
      if (e.key === "Enter" && creatable && inputValue && !safeOptions.find(opt => opt.value === inputValue)) {
        e.preventDefault();
        onChange([...safeSelected, inputValue]);
        setInputValue("");
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  const selectables = safeOptions.filter((option) => !safeSelected.includes(option.value));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className}`}
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {safeSelected.map((option) => {
            const label = safeOptions.find((o) => o.value === option)?.label || option;
            return (
              <Badge
                key={option}
                variant="secondary"
                className="hover:bg-secondary"
              >
                {label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (selectables.length > 0 || (creatable && inputValue)) ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...safeSelected, option.value]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                );
              })}
              {creatable && inputValue && !safeOptions.find(opt => opt.value === inputValue) && (
                <CommandItem
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => {
                    setInputValue("");
                    onChange([...safeSelected, inputValue]);
                  }}
                  className={"cursor-pointer"}
                >
                  Create "{inputValue}"
                </CommandItem>
              )}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}