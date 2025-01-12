import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMentorCard } from "@/components/participant/teams/TeamMentorCard";
import { TeamMentorDetails } from "@/components/participant/teams/sections/TeamMentorDetails";
import { ReassignMentorDialog } from "../dialogs/ReassignMentorDialog";
import { AssignMentorDialog } from "../dialogs/AssignMentorDialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TeamMentorSectionProps {
  teamId: string;
  mentorId: string | null;
  teamName: string;
  onMentorUpdated: () => void;
}

export function TeamMentorSection({ 
  teamId, 
  mentorId, 
  teamName,
  onMentorUpdated 
}: TeamMentorSectionProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);

  const handleRemoveMentor = async () => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ mentor_id: null })
        .eq('id', teamId);

      if (error) throw error;
      toast.success("Mentor removed successfully");
      onMentorUpdated();
    } catch (error) {
      console.error('Error removing mentor:', error);
      toast.error("Failed to remove mentor");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Mentor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TeamMentorCard mentorId={mentorId} />
        
        {mentorId && (
          <div className="mt-4">
            <TeamMentorDetails mentorId={mentorId} />
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {mentorId ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsReassignDialogOpen(true)}
              >
                Reassign Mentor
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRemoveMentor}
              >
                Remove Mentor
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsAssignDialogOpen(true)}
            >
              Assign Mentor
            </Button>
          )}
        </div>

        <AssignMentorDialog
          isOpen={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          onMentorAssigned={onMentorUpdated}
          teamId={teamId}
        />

        <ReassignMentorDialog
          isOpen={isReassignDialogOpen}
          onOpenChange={setIsReassignDialogOpen}
          teamName={teamName}
          onConfirm={() => {
            // This will trigger the auto-assignment function
            handleRemoveMentor().then(() => {
              setIsAssignDialogOpen(true);
            });
          }}
        />
      </CardContent>
    </Card>
  );
}