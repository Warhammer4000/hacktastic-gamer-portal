import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MentorCard } from "./components/MentorCard";
import { SearchBar } from "./components/SearchBar";
import { BulkActions } from "./components/BulkActions";
import type { Mentor } from "./types";

export default function MentorApproval() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: mentors, isLoading, refetch } = useQuery({
    queryKey: ["pending-mentors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "pending_approval");

      if (error) throw error;
      return data as Mentor[];
    },
  });

  const filteredMentors = mentors?.filter(mentor => 
    mentor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (mentorId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "approved", is_profile_approved: true })
      .eq("id", mentorId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve mentor",
      });
    } else {
      toast({
        title: "Success",
        description: "Mentor has been approved",
      });
      refetch();
    }
  };

  const handleReject = async (mentorId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "flagged", is_profile_approved: false })
      .eq("id", mentorId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject mentor",
      });
    } else {
      toast({
        title: "Success",
        description: "Mentor has been rejected",
      });
      refetch();
    }
  };

  const handleApproveSelected = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "approved", is_profile_approved: true })
      .in("id", selectedMentors);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve selected mentors",
      });
    } else {
      toast({
        title: "Success",
        description: `${selectedMentors.length} mentors have been approved`,
      });
      setSelectedMentors([]);
      refetch();
    }
  };

  const handleRejectSelected = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "flagged", is_profile_approved: false })
      .in("id", selectedMentors);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject selected mentors",
      });
    } else {
      toast({
        title: "Success",
        description: `${selectedMentors.length} mentors have been rejected`,
      });
      setSelectedMentors([]);
      refetch();
    }
  };

  const toggleMentorSelection = (mentorId: string) => {
    setSelectedMentors(prev => 
      prev.includes(mentorId) 
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mentor Approval</h1>
        <div className="flex items-center gap-4">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <BulkActions
            selectedCount={selectedMentors.length}
            onApproveSelected={handleApproveSelected}
            onRejectSelected={handleRejectSelected}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors?.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            onApprove={handleApprove}
            onReject={handleReject}
            isSelected={selectedMentors.includes(mentor.id)}
            onToggleSelect={toggleMentorSelection}
          />
        ))}
      </div>
    </div>
  );
}