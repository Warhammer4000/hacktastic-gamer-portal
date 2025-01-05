import { Filter } from "lucide-react";
import { SearchInput } from "./SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTechStack: string;
  onTechStackChange: (value: string) => void;
  techStacks?: { id: string; name: string; }[];
}

export function TeamFilters({
  searchQuery,
  onSearchChange,
  selectedTechStack,
  onTechStackChange,
  techStacks,
}: TeamFiltersProps) {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search teams..."
          className="w-full"
        />
      </div>
      <Select value={selectedTechStack} onValueChange={onTechStackChange}>
        <SelectTrigger className="w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Tech Stack" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tech Stacks</SelectItem>
          {techStacks?.map((stack) => (
            <SelectItem key={stack.id} value={stack.id}>
              {stack.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}