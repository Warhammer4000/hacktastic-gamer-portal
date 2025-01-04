import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function MentorUsers() {
  const { data: mentors, isLoading, refetch } = useQuery({
    queryKey: ['mentor-users'],
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
        .eq('user_roles.role', 'mentor');

      if (error) throw error;
      return profiles;
    },
  });

  const handleDelete = async (mentorId: string) => {
    if (!window.confirm('Are you sure you want to remove this mentor?')) return;

    const { error: roleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', mentorId)
      .eq('role', 'mentor');

    if (roleError) {
      toast.error('Failed to remove mentor role');
      return;
    }

    toast.success('Mentor role removed successfully');
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mentor Management</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors?.map((mentor) => (
            <TableRow key={mentor.id}>
              <TableCell>{mentor.full_name}</TableCell>
              <TableCell>{mentor.email}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(mentor.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}