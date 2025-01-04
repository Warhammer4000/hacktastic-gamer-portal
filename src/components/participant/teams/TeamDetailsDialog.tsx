import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamForm, type TeamFormValues } from "./forms/TeamForm";

interface TeamDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  team: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    tech_stack: {
      name: string;
    } | null;
    tech_stack_id: string | null;
    repository_url: string | null;
    leader_id: string;
  };
}

export function TeamDetailsDialog({ isOpen, onOpenChange, team }: TeamDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const isTeamLeader = team.leader_id === currentUser?.id;

  const { data: techStacks, isLoading: isLoadingTechStacks } = useQuery({
    queryKey: ['technology-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = async (data: TeamFormValues) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: data.name,
          description: data.description,
          tech_stack_id: data.techStackId,
        })
        .eq('id', team.id);

      if (error) throw error;

      toast.success("Team updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['participant-team'] });
    } catch (error) {
      toast.error("Failed to update team. Please try again.");
      console.error("Error updating team:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Team</DialogTitle>
              <DialogDescription>
                Update your team's information.
              </DialogDescription>
            </DialogHeader>
            <TeamForm
              onSubmit={handleEdit}
              techStacks={techStacks}
              isLoadingTechStacks={isLoadingTechStacks}
              defaultValues={{
                name: team.name,
                description: team.description || undefined,
                techStackId: team.tech_stack_id || undefined,
              }}
              submitLabel="Save Changes"
            />
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="mt-2"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{team.name}</DialogTitle>
              {team.description && (
                <DialogDescription>
                  {team.description}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Team Details</h4>
                <p className="text-sm text-muted-foreground">Status: {team.status}</p>
                {team.tech_stack && (
                  <p className="text-sm text-muted-foreground">
                    Tech Stack: {team.tech_stack.name}
                  </p>
                )}
                {team.repository_url && (
                  <p className="text-sm text-muted-foreground">
                    Repository: <a href={team.repository_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View on GitHub</a>
                  </p>
                )}
              </div>
              {isTeamLeader && team.status !== 'locked' && (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Team
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}