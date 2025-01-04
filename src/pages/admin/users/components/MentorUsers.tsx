import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Upload, Search } from "lucide-react";
import AddMentorDialog from "./AddMentorDialog";
import BulkMentorUploadDialog from "./BulkMentorUploadDialog";
import { ViewToggle } from "@/components/ui/view-toggle";
import { UserCard } from "@/components/admin/users/UserCard";
import { MentorTable } from "./mentor/MentorTable";
import { useMentorActions } from "./mentor/useMentorActions";

export default function MentorUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [view, setView] = useState<"table" | "card">("table");

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['mentor-users', searchQuery],
    queryFn: async () => {
      const query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (role)
        `)
        .eq('user_roles.role', 'mentor');

      if (searchQuery) {
        query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { handleEdit, handleDelete } = useMentorActions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
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
          <ViewToggle view={view} onViewChange={setView} />
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

      {view === "table" ? (
        <MentorTable 
          mentors={mentors || []} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors?.map((mentor) => (
            <UserCard
              key={mentor.id}
              user={mentor}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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