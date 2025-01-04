import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddParticipantDialog from "./AddParticipantDialog";
import BulkParticipantUploadDialog from "./BulkParticipantUploadDialog";
import ParticipantTable from "./ParticipantTable";

export default function ParticipantUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);

  const { data: participants, isLoading } = useQuery({
    queryKey: ["participants", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner (role)
        `)
        .eq("user_roles.role", "participant");

      if (searchQuery) {
        query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="space-x-2">
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Participant
          </Button>
          <Button variant="outline" onClick={() => setShowBulkUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>

      <ParticipantTable participants={participants || []} isLoading={isLoading} />

      <AddParticipantDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
      
      <BulkParticipantUploadDialog
        open={showBulkUploadDialog}
        onOpenChange={setShowBulkUploadDialog}
      />
    </div>
  );
}