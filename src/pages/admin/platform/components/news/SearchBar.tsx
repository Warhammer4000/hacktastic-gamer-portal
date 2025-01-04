import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";

type SearchBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
};

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedTags = [],
  onTagsChange,
  availableTags = [],
}: SearchBarProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search news posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-72">
        <MultiSelect
          placeholder="Filter by tags..."
          selected={selectedTags}
          options={availableTags.map(tag => ({ label: tag, value: tag }))}
          onChange={onTagsChange}
        />
      </div>
    </div>
  );
}