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
import { MentorData } from "../../types/mentor";

export function MentorContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const { handleDelete, confirmDelete, isDeleteDialogOpen, setIsDeleteDialogOpen } = useMentorActions();
  
  const { data: mentors, isLoading } = useQuery({
    queryKey: ["mentor-users", searchQuery, selectedStatus],
    queryFn: async () => {
      const query = supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner (role),
          mentor_preferences!left (
            team_count
          ),
          mentor_tech_stacks!left (
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
        query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      if (selectedStatus) {
        query.eq("status", selectedStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MentorData[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <MentorHeader
          onBulkUpload={() => setShowBulkUploadDialog(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <MentorFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>

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