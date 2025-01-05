import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Upload, Search } from "lucide-react";
import { toast } from "sonner";
import AddParticipantDialog from "./AddParticipantDialog";
import BulkParticipantUploadDialog from "./BulkParticipantUploadDialog";
import ParticipantTable from "./ParticipantTable";
import { ViewToggle } from "@/components/ui/view-toggle";
import { UserCard } from "@/components/admin/users/UserCard";

export default function ParticipantUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [view, setView] = useState<"table" | "card">("table");
  const queryClient = useQueryClient();

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

  const deleteParticipant = useMutation({
    mutationFn: async (userId: string) => {
      // First remove the participant role
      const { error: deleteRoleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'participant');

      if (deleteRoleError) throw deleteRoleError;

      // Then check for remaining roles
      const { data: remainingRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      // If no other roles exist, delete the profile
      if (!remainingRoles?.length) {
        const { error: deleteProfileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (deleteProfileError) throw deleteProfileError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participant removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove participant');
      console.error('Error:', error);
    },
  });

  const handleEdit = (userId: string) => {
    // Implement edit functionality
    console.log('Edit participant:', userId);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      deleteParticipant.mutate(userId);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
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
          <ViewToggle view={view} onViewChange={setView} />
        </div>
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
      </div>

      {view === "table" ? (
        <ParticipantTable 
          participants={participants || []} 
          isLoading={isLoading} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants?.map((participant) => (
            <UserCard
              key={participant.id}
              user={participant}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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