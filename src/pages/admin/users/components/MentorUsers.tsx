import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Upload, Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import BulkMentorUploadDialog from "./BulkMentorUploadDialog";
import AddMentorDialog from "./AddMentorDialog";

export default function MentorUsers() {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['mentor-users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          github_username,
          linkedin_profile_id,
          status,
          user_roles!inner (
            role
          )
        `)
        .eq('user_roles.role', 'mentor');

      if (error) throw error;
      return profiles;
    },
  });

  const deleteMentor = useMutation({
    mutationFn: async (mentorId: string) => {
      // Delete from auth.users will cascade to profiles and user_roles
      const { error } = await supabase.auth.admin.deleteUser(mentorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
      toast.success('Mentor has been removed');
      setMentorToDelete(null);
    },
    onError: (error) => {
      toast.error('Failed to remove mentor');
      console.error('Error:', error);
    },
  });

  const toggleMentorStatus = useMutation({
    mutationFn: async ({ mentorId, newStatus }: { mentorId: string, newStatus: 'pending_approval' | 'approved' }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: newStatus,
          is_profile_approved: newStatus === 'approved'
        })
        .eq('id', mentorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
      toast.success('Mentor status updated');
    },
    onError: (error) => {
      toast.error('Failed to update mentor status');
      console.error('Error:', error);
    },
  });

  const filteredMentors = mentors?.filter(mentor => 
    mentor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button onClick={() => setIsAddMentorOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Mentor
          </Button>
          <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>GitHub</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMentors?.map((mentor) => (
            <TableRow key={mentor.id}>
              <TableCell>{mentor.full_name}</TableCell>
              <TableCell>{mentor.email}</TableCell>
              <TableCell>{mentor.github_username}</TableCell>
              <TableCell>{mentor.linkedin_profile_id}</TableCell>
              <TableCell>{mentor.status}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {mentor.status === 'approved' ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleMentorStatus.mutate({ 
                        mentorId: mentor.id, 
                        newStatus: 'pending_approval' 
                      })}
                      title="Set to pending"
                    >
                      <ToggleRight className="h-4 w-4" />
                    </Button>
                  ) : mentor.status === 'pending_approval' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleMentorStatus.mutate({ 
                        mentorId: mentor.id, 
                        newStatus: 'approved' 
                      })}
                      title="Approve mentor"
                    >
                      <ToggleLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMentorToDelete(mentor.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddMentorDialog
        open={isAddMentorOpen}
        onOpenChange={setIsAddMentorOpen}
      />

      <BulkMentorUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
      />

      <AlertDialog open={!!mentorToDelete} onOpenChange={() => setMentorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the mentor's account
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mentorToDelete && deleteMentor.mutate(mentorToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}