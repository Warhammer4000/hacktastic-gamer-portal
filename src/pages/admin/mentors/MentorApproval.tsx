import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, ExternalLink, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Mentor {
  id: string;
  full_name: string | null;
  email: string;
  linkedin_profile_id: string | null;
  github_username: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: 'pending_approval' | 'approved' | 'flagged' | 'incomplete';
}

const MentorApproval = () => {
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
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {selectedMentors.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={handleApproveSelected} variant="default">
                <CheckCircle className="mr-2" />
                Approve Selected ({selectedMentors.length})
              </Button>
              <Button onClick={handleRejectSelected} variant="destructive">
                <XCircle className="mr-2" />
                Reject Selected ({selectedMentors.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors?.map((mentor) => (
          <Card key={mentor.id} className="relative">
            <input
              type="checkbox"
              checked={selectedMentors.includes(mentor.id)}
              onChange={() => toggleMentorSelection(mentor.id)}
              className="absolute top-4 right-4"
            />
            <CardHeader>
              <div className="flex items-center gap-4">
                {mentor.avatar_url && (
                  <img
                    src={mentor.avatar_url}
                    alt={mentor.full_name || ""}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <CardTitle>{mentor.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{mentor.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{mentor.bio}</p>
              <div className="flex gap-2">
                {mentor.linkedin_profile_id && (
                  <a
                    href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Badge variant="secondary">
                      LinkedIn
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Badge>
                  </a>
                )}
                {mentor.github_username && (
                  <a
                    href={`https://github.com/${mentor.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Badge variant="secondary">
                      GitHub
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Badge>
                  </a>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleReject(mentor.id)}
              >
                <XCircle className="mr-2" />
                Reject
              </Button>
              <Button
                variant="default"
                onClick={() => handleApprove(mentor.id)}
              >
                <CheckCircle className="mr-2" />
                Approve
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MentorApproval;