import { useState } from "react";
import { useMentorList } from "./mentor/useMentorList";
import { MentorContent } from "./mentor/MentorContent";
import { MentorHeader } from "./mentor/MentorHeader";
import { MentorTable } from "./mentor/MentorTable";
import { useDebounce } from "@/hooks/use-debounce";

export default function MentorUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: mentors, isLoading } = useMentorList(debouncedSearch, selectedTechStacks);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleTechStackChange = (techStacks: string[]) => {
    setSelectedTechStacks(techStacks);
  };

  return (
    <div className="space-y-4">
      <MentorHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedTechStacks={selectedTechStacks}
        onTechStacksChange={handleTechStackChange}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MentorTable
          mentors={mentors || []}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
}