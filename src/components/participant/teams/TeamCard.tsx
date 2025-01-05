import { useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TeamMembersSection } from "./sections/TeamMembersSection";
import { TeamDetailsSection } from "./sections/TeamDetailsSection";
import { TeamHeaderActions } from "./sections/TeamHeaderActions";
import { useQueryClient } from "@tanstack/react-query";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    join_code: string;
    leader_id: string;
    mentor_id: string | null;
    tech_stack: {
      name: string;
      icon_url: string;
    } | null;
  };
  onEditTeam: () => void;
  onDeleteTeam: () => void;
  isLocked: boolean;
  currentUserId: string;
}

export function TeamCard({ 
  team, 
  onEditTeam, 
  onDeleteTeam, 
  isLocked,
  currentUserId 
}: TeamCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isLeader = currentUserId === team.leader_id;
  const queryClient = useQueryClient();

  const handleToggleStatus = async () => {
    if (!isLeader || isLocked) return;
    
    setIsUpdating(true);
    const newStatus = team.status === 'draft' ? 'open' : 'draft';
    
    queryClient.setQueryData(['participant-team'], (oldData: any) => ({
      ...oldData,
      status: newStatus,
    }));

    try {
      const { error } = await supabase
        .from('teams')
        .update({ status: newStatus })
        .eq('id', team.id);

      if (error) throw error;
      toast.success(`Team is now ${newStatus}`);
      
      queryClient.invalidateQueries({ queryKey: ['participant-team'] });
    } catch (error) {
      queryClient.setQueryData(['participant-team'], (oldData: any) => ({
        ...oldData,
        status: team.status,
      }));
      console.error('Error updating team status:', error);
      toast.error("Failed to update team status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLockTeam = async () => {
    if (!isLeader || isLocked) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('teams')
        .update({ status: 'locked' })
        .eq('id', team.id);

      if (error) throw error;
      
      toast.success("Team locked successfully!");
      queryClient.invalidateQueries({ queryKey: ['participant-team'] });
    } catch (error) {
      console.error('Error locking team:', error);
      toast.error("Failed to lock team");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignMentor = async () => {
    console.log('handleAssignMentor called');
    if (!isLeader || !isLocked) {
      console.log('Conditions not met:', { isLeader, isLocked });
      return;
    }
    
    setIsUpdating(true);
    try {
      console.log('Calling assign_mentor_to_team RPC with team_id:', team.id);
      const { data: mentorId, error: mentorError } = await supabase
        .rpc('assign_mentor_to_team', { team_id: team.id });

      if (mentorError) {
        console.error('RPC error:', mentorError);
        throw mentorError;
      }

      console.log('RPC response:', { mentorId });

      if (!mentorId) {
        toast.error(
          "No eligible mentors available. This could be because:" +
          "\n- No mentors match your team's tech stack" +
          "\n- Available mentors have reached their team limit"
        );
        return;
      }

      toast.success("Mentor assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ['participant-team'] });
    } catch (error) {
      console.error('Error assigning mentor:', error);
      toast.error("Failed to assign mentor. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Details
          </CardTitle>
          <TeamHeaderActions
            isLeader={isLeader}
            isLocked={isLocked}
            status={team.status}
            isUpdating={isUpdating}
            onStatusToggle={handleToggleStatus}
            onEdit={onEditTeam}
            onDelete={onDeleteTeam}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <TeamDetailsSection
            name={team.name}
            description={team.description}
            status={team.status}
            techStack={team.tech_stack}
            joinCode={team.join_code}
            mentorId={team.mentor_id}
            isLeader={isLeader}
            isLocked={isLocked}
            onAssignMentor={handleAssignMentor}
            teamId={team.id}
          />

          <TeamMembersSection
            teamId={team.id}
            isLeader={isLeader}
            isLocked={isLocked}
            onLockTeam={handleLockTeam}
          />
        </div>
      </CardContent>
    </Card>
  );
}