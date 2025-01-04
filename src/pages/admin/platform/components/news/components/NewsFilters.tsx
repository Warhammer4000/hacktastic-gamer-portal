import { SearchBar } from "../SearchBar";

type NewsFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
};

export function NewsFilters({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  availableTags,
}: NewsFiltersProps) {
  return (
    <SearchBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      selectedTags={selectedTags}
      onTagsChange={onTagsChange}
      availableTags={availableTags}
    />
  );
}