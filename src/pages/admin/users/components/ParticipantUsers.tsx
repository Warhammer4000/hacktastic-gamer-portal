import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BulkParticipantUploadDialog from "./BulkParticipantUploadDialog";
import { ParticipantActionsBar } from "./participant/ParticipantActionsBar";
import { ParticipantSearchBar } from "./participant/ParticipantSearchBar";
import { ParticipantList } from "./participant/ParticipantList";
import { useParticipantActions } from "./participant/useParticipantActions";
import { useDebounce } from "../hooks/useDebounce";

export default function ParticipantUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const navigate = useNavigate();
  const { handleDelete } = useParticipantActions();
  
  // Use debounced search value for the query
  const debouncedSearch = useDebounce(searchQuery);

  const { data: participants, isLoading } = useQuery({
    queryKey: ["participants", debouncedSearch],
    queryFn: async () => {
      const query = supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner (
            id,
            user_id,
            role,
            created_at
          ),
          institutions (
            name,
            type
          )
        `)
        .eq("user_roles.role", "participant");

      if (debouncedSearch) {
        query.or(`email.ilike.%${debouncedSearch}%,full_name.ilike.%${debouncedSearch}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  const handleEdit = (userId: string) => {
    navigate(`/admin/participants/edit/${userId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ParticipantActionsBar
          onBulkUpload={() => setShowBulkUploadDialog(true)}
        />
        <ParticipantSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <ParticipantList
        participants={participants || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <BulkParticipantUploadDialog
        open={showBulkUploadDialog}
        onOpenChange={setShowBulkUploadDialog}
      />
    </div>
  );
}