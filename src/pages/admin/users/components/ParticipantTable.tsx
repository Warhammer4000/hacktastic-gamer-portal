import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ParticipantTableProps {
  participants: Array<{
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    github_username: string | null;
    linkedin_profile_id: string | null;
    status: string;
    user_roles: {
      role: string;
    };
  }>;
  isLoading: boolean;
}

export default function ParticipantTable({ participants, isLoading }: ParticipantTableProps) {
  const queryClient = useQueryClient();

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>GitHub</TableHead>
          <TableHead>LinkedIn</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((participant) => (
          <TableRow key={participant.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={participant.avatar_url || ''} alt={participant.full_name || ''} />
                <AvatarFallback>{participant.full_name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <span>{participant.full_name || participant.email}</span>
            </TableCell>
            <TableCell>{participant.email}</TableCell>
            <TableCell>{participant.github_username || '-'}</TableCell>
            <TableCell>{participant.linkedin_profile_id || '-'}</TableCell>
            <TableCell>
              <Badge variant="outline">{participant.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(participant.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(participant.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}