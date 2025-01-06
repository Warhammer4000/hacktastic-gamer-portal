import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Upload, Search, Download } from "lucide-react";
import AddMentorDialog from "./AddMentorDialog";
import BulkMentorUploadDialog from "./BulkMentorUploadDialog";
import { ViewToggle } from "@/components/ui/view-toggle";
import { UserCard } from "@/components/admin/users/UserCard";
import { MentorTable } from "./mentor/MentorTable";
import { useMentorActions } from "./mentor/useMentorActions";
import { MentorData } from "../types/mentor";
import * as XLSX from 'xlsx';
import { Toggle } from "@/components/ui/toggle";

export default function MentorUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [view, setView] = useState<"table" | "card">("table");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);

  // Query to fetch tech stacks for the filter
  const { data: techStacks } = useQuery({
    queryKey: ['tech-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['mentor-users', searchQuery, selectedTechStacks],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (role),
          mentor_preferences!left (
            team_count
          ),
          mentor_tech_stacks!left (
            tech_stack_id,
            technology_stacks (
              name
            )
          ),
          institutions (
            name
          )
        `)
        .eq('user_roles.role', 'mentor');

      if (searchQuery) {
        query = query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      if (selectedTechStacks.length > 0) {
        const mentorIds = await supabase
          .from('mentor_tech_stacks')
          .select('mentor_id')
          .in('tech_stack_id', selectedTechStacks);

        if (mentorIds.data) {
          query = query.in('id', mentorIds.data.map(item => item.mentor_id));
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data as any[]).map(mentor => ({
        ...mentor,
        mentor_preferences: mentor.mentor_preferences || [],
        mentor_tech_stacks: mentor.mentor_tech_stacks || []
      })) as MentorData[];
    },
  });

  const { handleEdit, handleDelete } = useMentorActions();

  const handleExport = () => {
    if (!mentors) return;

    const exportData = mentors.map(mentor => ({
      email: mentor.email,
      full_name: mentor.full_name || '',
      github_username: mentor.github_username || '',
      linkedin_profile_id: mentor.linkedin_profile_id || '',
      institution: mentor.institutions?.name || '',
      team_count: mentor.mentor_preferences?.[0]?.team_count || 1,
      tech_stacks: mentor.mentor_tech_stacks
        ?.map(stack => stack.technology_stacks?.name)
        .filter(Boolean)
        .join(', ') || '',
      status: mentor.status,
      bio: mentor.bio || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mentors");
    XLSX.writeFile(wb, "mentors.xlsx");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="space-x-2">
            <Button onClick={() => setIsAddMentorOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Mentor
            </Button>
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
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
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Filter by Technology</h3>
        <div className="flex flex-wrap gap-2">
          {techStacks?.map((stack) => (
            <Toggle
              key={stack.id}
              pressed={selectedTechStacks.includes(stack.id)}
              onPressedChange={(pressed) => {
                setSelectedTechStacks(prev =>
                  pressed
                    ? [...prev, stack.id]
                    : prev.filter(id => id !== stack.id)
                );
              }}
              className="bg-emerald-500 data-[state=on]:bg-emerald-700 text-white hover:bg-emerald-600"
            >
              {stack.name}
            </Toggle>
          ))}
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