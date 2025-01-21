import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCard } from "@/components/admin/users/UserCard";
import { DeleteUserDialog } from "../DeleteUserDialog";
import { useMentorActions } from "./useMentorActions";
import { MentorHeader } from "./MentorHeader";
import { MentorFilters } from "./MentorFilters";
import BulkMentorUploadDialog from "../mentor/bulk-upload/BulkMentorUploadDialog";
import type { MentorData } from "../../types/mentor";

export function MentorContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const { handleDelete, confirmDelete, isDeleteDialogOpen, setIsDeleteDialogOpen } = useMentorActions();

  const { data: mentors, isLoading } = useQuery({
    queryKey: ["mentors", searchQuery, selectedTechStacks],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (role),
          mentor_preferences (
            team_count
          ),
          mentor_tech_stacks (
            tech_stack_id,
            technology_stacks (
              name
            )
          ),
          institutions (
            name
          )
        `)
        .eq('user_roles.role', 'mentor');

      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      if (selectedTechStacks.length > 0) {
        const mentorIds = await supabase
          .from('mentor_tech_stacks')
          .select('user_id')
          .in('tech_stack_id', selectedTechStacks);

        if (mentorIds.data) {
          query = query.in('id', mentorIds.data.map(item => item.user_id));
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as MentorData[];
    },
  });

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
        onBulkUpload={() => setShowBulkUploadDialog(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <MentorFilters
        selectedTechStacks={selectedTechStacks}
        onTechStackChange={handleTechStackChange}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mentors?.map((mentor) => (
          <UserCard
            key={mentor.id}
            user={mentor}
            onEdit={(userId) => navigate(`/admin/mentors/edit/${userId}`)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        userType="mentor"
      />

      <BulkMentorUploadDialog
        open={showBulkUploadDialog}
        onOpenChange={setShowBulkUploadDialog}
      />
    </div>
  );
}