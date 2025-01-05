import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import EditParticipantDialog from "./EditParticipantDialog";

interface Participant {
  id: string;
  full_name: string | null;
  email: string;
}

export default function ParticipantTable() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const queryClient = useQueryClient();

  const { data: participants, isLoading } = useQuery({
    queryKey: ['participant-users'],
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
        .eq('user_roles.role', 'participant');

      if (error) throw error;
      return profiles;
    },
  });

  const deleteParticipant = useMutation({
    mutationFn: async (userId: string) => {
      // First delete related records
      const deletions = [
        // Delete user roles
        supabase.from('user_roles').delete().eq('user_id', userId),
        // Delete levels
        supabase.from('levels').delete().eq('user_id', userId),
        // Delete team memberships
        supabase.from('team_members').delete().eq('user_id', userId),
        // Delete profile
        supabase.from('profiles').delete().eq('id', userId),
      ];

      // Execute all deletions
      const results = await Promise.all(deletions);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Failed to delete user data');
      }

      // Finally delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participant-users'] });
      toast.success('Participant removed successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to remove participant');
      console.error('Error:', error);
    },
  });

  const handleEdit = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this participant?')) {
      deleteParticipant.mutate(userId);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants?.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.full_name}</TableCell>
              <TableCell>{participant.email}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(participant)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(participant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditParticipantDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        participant={selectedParticipant}
      />
    </>
  );
}