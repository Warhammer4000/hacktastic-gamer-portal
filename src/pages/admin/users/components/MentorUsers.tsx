import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Upload } from "lucide-react";
import BulkMentorUploadDialog from "./BulkMentorUploadDialog";
import AddMentorDialog from "./AddMentorDialog";

export default function MentorUsers() {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);

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
          user_roles!inner (
            role
          )
        `)
        .eq('user_roles.role', 'mentor');

      if (error) throw error;
      return profiles;
    },
  });

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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>GitHub</TableHead>
            <TableHead>LinkedIn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors?.map((mentor) => (
            <TableRow key={mentor.id}>
              <TableCell>{mentor.full_name}</TableCell>
              <TableCell>{mentor.email}</TableCell>
              <TableCell>{mentor.github_username}</TableCell>
              <TableCell>{mentor.linkedin_profile_id}</TableCell>
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
    </div>
  );
}