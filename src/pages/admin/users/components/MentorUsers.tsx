import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddMentorDialog from "./AddMentorDialog";
import BulkMentorUploadDialog from "./mentor/bulk-upload/BulkMentorUploadDialog";
import { useMentorActions } from "./mentor/useMentorActions";
import { MentorHeader } from "./mentor/MentorHeader";
import { MentorFilters } from "./mentor/MentorFilters";
import { MentorContent } from "./mentor/MentorContent";
import { useMentorList } from "./mentor/useMentorList";
import { exportMentors } from "./mentor/MentorExport";
import { useDebounce } from "@/hooks/use-debounce";

export default function MentorUsers() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { deleteMentor } = useMentorActions();
  const { data: mentors, isLoading } = useMentorList(debouncedSearch, selectedTechStacks);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <MentorHeader
        onAddMentor={() => setIsAddMentorOpen(true)}
        onBulkUpload={() => setIsBulkUploadOpen(true)}
        onExport={() => exportMentors(mentors || [])}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
      />

      <MentorFilters
        selectedTechStacks={selectedTechStacks}
        onTechStackChange={handleTechStackChange}
      />

      <MentorContent
        mentors={mentors || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddMentorDialog
        open={isAddMentorOpen}
        onOpenChange={setIsAddMentorOpen}
      />
      
      <BulkMentorUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
}