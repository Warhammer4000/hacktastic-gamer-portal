import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchInput } from "@/components/participant/teams/components/SearchInput";
import { Loader2 } from "lucide-react";
import { MentorCard } from "./MentorCard";

interface AssignMentorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamId: string;
  teamTechStackId: string | null;
  onConfirm: () => void;
}

export function AssignMentorDialog({
  isOpen,
  onOpenChange,
  teamName,
  teamId,
  teamTechStackId,
  onConfirm,
}: AssignMentorDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: mentors, isLoading } = useQuery({
    queryKey: ["eligible-mentors", teamTechStackId],
    queryFn: async () => {
      const { data: mentorsData, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          mentor_tech_stacks!inner (
            technology_stacks (
              id,
              name
            )
          )
        `)
        .eq("mentor_tech_stacks.tech_stack_id", teamTechStackId);

      if (error) throw error;

      // Get team counts for each mentor
      const mentorsWithTeams = await Promise.all(
        mentorsData.map(async (mentor) => {
          const { data: teams } = await supabase
            .from("teams")
            .select("id")
            .eq("mentor_id", mentor.id)
            .eq("status", "locked");

          const { data: preferences } = await supabase
            .from("mentor_preferences")
            .select("team_count")
            .eq("mentor_id", mentor.id)
            .single();

          return {
            ...mentor,
            team_count: teams?.length || 0,
            max_teams: preferences?.team_count || 2,
          };
        })
      );

      return mentorsWithTeams.filter(
        (mentor) => mentor.team_count < mentor.max_teams
      );
    },
    enabled: !!teamTechStackId,
  });

  const filteredMentors = mentors?.filter((mentor) => {
    const searchTerm = search.toLowerCase();
    return (
      mentor.full_name?.toLowerCase().includes(searchTerm) ||
      mentor.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleAutoAssign = async () => {
    setIsAssigning(true);
    try {
      const { data: mentorId, error } = await supabase.rpc(
        "assign_mentor_to_team",
        {
          team_id: teamId,
        }
      );

      if (error) throw error;

      if (mentorId) {
        toast.success("Mentor assigned successfully!");
        onConfirm();
        onOpenChange(false);
      } else {
        toast.error("No eligible mentors available");
      }
    } catch (error) {
      console.error("Error auto-assigning mentor:", error);
      toast.error("Failed to auto-assign mentor");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleManualAssign = async () => {
    if (!selectedMentorId) {
      toast.error("Please select a mentor");
      return;
    }

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from("teams")
        .update({ mentor_id: selectedMentorId, status: "active" })
        .eq("id", teamId);

      if (error) throw error;

      toast.success("Mentor assigned successfully!");
      onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning mentor:", error);
      toast.error("Failed to assign mentor");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Mentor to {teamName}</DialogTitle>
          <DialogDescription>
            Choose a mentor manually or let the system auto-assign one based on
            tech stack and availability.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search mentors..."
            className="w-full"
          />

          <ScrollArea className="flex-1 h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredMentors?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No mentors found matching the search criteria
              </div>
            ) : (
              filteredMentors?.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  isSelected={selectedMentorId === mentor.id}
                  onSelect={setSelectedMentorId}
                />
              ))
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleAutoAssign}
            disabled={isAssigning}
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Auto-Assigning...
              </>
            ) : (
              "Auto-Assign"
            )}
          </Button>
          <Button
            onClick={handleManualAssign}
            disabled={isAssigning || !selectedMentorId}
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Selected"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}