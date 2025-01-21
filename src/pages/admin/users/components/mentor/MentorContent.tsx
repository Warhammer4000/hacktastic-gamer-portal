import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCard } from "@/components/admin/users/UserCard";
import { DeleteUserDialog } from "../DeleteUserDialog";
import { useMentorActions } from "./useMentorActions";
import MentorHeader from "./MentorHeader";
import MentorFilters from "./MentorFilters";
import BulkMentorUploadDialog from "./BulkMentorUploadDialog";

export function MentorContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const { handleDelete, confirmDelete, isDeleteDialogOpen, setIsDeleteDialogOpen } = useMentorActions();
  
  const { data: mentors, isLoading } = useQuery({
    queryKey: ["mentors", searchQuery, selectedStatus],
    queryFn: async () => {
      const query = supabase
        .from("mentors")
        .select("*");

      if (searchQuery) {
        query.ilike("full_name", `%${searchQuery}%`);
      }

      if (selectedStatus) {
        query.eq("status", selectedStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
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
        />
        <MentorFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
