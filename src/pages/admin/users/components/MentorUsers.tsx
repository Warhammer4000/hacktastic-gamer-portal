import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BulkMentorUploadDialog from "./mentor/bulk-upload/BulkMentorUploadDialog";
import { useMentorActions } from "./mentor/useMentorActions";
import { MentorHeader } from "./mentor/MentorHeader";
import { MentorFilters } from "./mentor/MentorFilters";
import { MentorContent } from "./mentor/MentorContent";
import { useMentorList } from "./mentor/useMentorList";
import { useDebounce } from "../hooks/useDebounce";

export default function MentorUsers() {
  const [searchInput, setSearchInput] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { handleDelete } = useMentorActions();
  
  const debouncedSearch = useDebounce(searchInput);
  
  const { data: mentors, isLoading } = useMentorList(debouncedSearch, selectedTechStacks);

  const handleEdit = (mentorId: string) => {
    navigate(`/admin/mentors/edit/${mentorId}`);
  };

  const handleTechStackChange = (techStackId: string, pressed: boolean) => {
    setSelectedTechStacks(prev =>
      pressed
        ? [...prev, techStackId]
        : prev.filter(id => id !== techStackId)
    );
  };

  return (
    <div className="space-y-4">
      <MentorHeader
        onBulkUpload={() => setIsBulkUploadOpen(true)}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
      />

      <MentorFilters
        selectedTechStacks={selectedTechStacks}
        onTechStackChange={handleTechStackChange}
      />

      <MentorContent
        mentors={mentors || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <BulkMentorUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
}