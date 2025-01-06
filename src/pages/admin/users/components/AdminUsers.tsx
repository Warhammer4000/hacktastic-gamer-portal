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

      if (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }

      return profiles.filter(profile => 
        profile.user_roles?.some(role => role.role === 'admin')
      );
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (userId: string) => {
      // First call our RPC function to delete all user data
      const { error: rpcError } = await supabase
        .rpc('delete_user_cascade', {
          user_id: userId
        });

      if (rpcError) {
        console.error('Error in delete_user_cascade:', rpcError);
        throw rpcError;
      }

      // No need to delete from auth.users as the cascade delete in profiles table
      // will trigger the deletion in auth.users due to the ON DELETE CASCADE constraint
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Administrator removed successfully');
    },
    onError: (error) => {
      console.error('Error removing administrator:', error);
      toast.error('Failed to remove administrator');
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