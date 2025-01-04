import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddAdminDialog from "./AddAdminDialog";
import BulkAdminUploadDialog from "./BulkAdminUploadDialog";
import AdminSearchBar from "./AdminSearchBar";
import AdminActionsBar from "./AdminActionsBar";
import AdminTable from "./AdminTable";

export default function AdminUsers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: admins, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          user_roles!inner (
            role
          )
        `)
        .eq('user_roles.role', 'admin');

      if (error) throw error;
      return profiles;
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (userId: string) => {
      const { error: deleteRoleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (deleteRoleError) throw deleteRoleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Administrator removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove administrator');
      console.error('Error:', error);
    },
  });

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this administrator?')) {
      deleteAdmin.mutate(userId);
    }
  };

  const filteredAdmins = admins?.filter(admin => 
    admin.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <AdminActionsBar
          onAddAdmin={() => setIsAddDialogOpen(true)}
          onBulkUpload={() => setIsBulkUploadOpen(true)}
        />
        <AdminSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <AdminTable
        admins={filteredAdmins || []}
        onDelete={handleDelete}
      />

      <AddAdminDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <BulkAdminUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />
    </div>
  );
}