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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AssignMentorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMentorAssigned: () => void;
  teamId: string;
  teamTechStackId: string | null;
}

export function AssignMentorDialog({
  isOpen,
  onClose,
  onMentorAssigned,
  teamId,
  teamTechStackId,
}: AssignMentorDialogProps) {
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: mentors } = useQuery({
    queryKey: ["mentors", teamTechStackId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          user_roles!inner (role),
          mentor_tech_stacks!inner (tech_stack_id)
        `)
        .eq("user_roles.role", "mentor")
        .eq("mentor_tech_stacks.tech_stack_id", teamTechStackId);
      if (error) throw error;
      return data;
    },
    enabled: !!teamTechStackId,
  });

  const handleAutoAssign = async () => {
    setIsSubmitting(true);
    try {
      const { data: mentorId, error } = await supabase.rpc("assign_mentor_to_team", {
        team_id: teamId,
      });

      if (error) throw error;

      if (mentorId) {
        toast.success("Mentor assigned successfully!");
        onMentorAssigned();
        onClose();
      } else {
        toast.error("No eligible mentors available");
      }
    } catch (error) {
      console.error("Error auto-assigning mentor:", error);
      toast.error("Failed to auto-assign mentor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAssign = async () => {
    if (!selectedMentorId) {
      toast.error("Please select a mentor");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("teams")
        .update({ mentor_id: selectedMentorId, status: "active" })
        .eq("id", teamId);

      if (error) throw error;

      toast.success("Mentor assigned successfully!");
      onMentorAssigned();
      onClose();
    } catch (error) {
      console.error("Error assigning mentor:", error);
      toast.error("Failed to assign mentor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Mentor</DialogTitle>
          <DialogDescription>
            Choose a mentor manually or let the system auto-assign one based on tech stack and availability.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Mentor</Label>
            <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors?.map((mentor) => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    {mentor.full_name || mentor.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleAutoAssign}
              disabled={isSubmitting}
            >
              Auto-Assign
            </Button>
            <Button
              onClick={handleManualAssign}
              disabled={isSubmitting || !selectedMentorId}
            >
              Assign Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}