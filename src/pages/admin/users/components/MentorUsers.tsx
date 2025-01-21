import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BulkMentorUploadDialog from "./mentor/bulk-upload/BulkMentorUploadDialog";
import { useMentorActions } from "./mentor/useMentorActions";
import { MentorHeader } from "./mentor/MentorHeader";
import { MentorFilters } from "./mentor/MentorFilters";
import { MentorContent } from "./mentor/MentorContent";
import { useMentorList } from "./mentor/useMentorList";
import { exportMentors } from "./mentor/MentorExport";
import { useDebounce } from "../hooks/useDebounce";

export default function MentorUsers() {
  const [searchInput, setSearchInput] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { deleteMentor } = useMentorActions();
  
  // Use debounced search value for the query
  const debouncedSearch = useDebounce(searchInput);
  
  const { data: mentors, isLoading } = useMentorList(debouncedSearch, selectedTechStacks);

  // Memoize filtered mentors to prevent unnecessary recalculations
  const filteredMentors = useMemo(() => {
    if (!mentors) return [];
    return mentors;
  }, [mentors]);

  const handleEdit = (mentorId: string) => {
    navigate(`/admin/mentors/edit/${mentorId}`);
  };

  const handleDelete = (mentorId: string) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      deleteMentor.mutate(mentorId);
    }
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
        onExport={() => exportMentors(filteredMentors)}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
      />

      <MentorFilters
        selectedTechStacks={selectedTechStacks}
        onTechStackChange={handleTechStackChange}
      />

      <MentorContent
        mentors={filteredMentors}
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