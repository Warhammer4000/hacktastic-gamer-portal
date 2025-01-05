import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamDetailsForm } from "./dialogs/TeamDetailsForm";
import { TeamDetailsView } from "./dialogs/TeamDetailsView";
import type { TeamFormValues } from "./forms/TeamForm";

interface TeamDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  team?: {
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
    if (!team) return;
    
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

  const isTeamLeader = team && currentUser ? team.leader_id === currentUser.id : false;
  const isLocked = team?.status === 'locked';

  if (!team) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Team details are not available.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {isEditing ? (
          <TeamDetailsForm
            onSubmit={handleEdit}
            techStacks={techStacks}
            isLoadingTechStacks={isLoadingTechStacks}
            team={team}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <TeamDetailsView
            team={team}
            isTeamLeader={isTeamLeader}
            isLocked={isLocked}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}