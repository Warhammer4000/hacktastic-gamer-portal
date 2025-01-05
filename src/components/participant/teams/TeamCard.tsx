import { useState } from "react";
import { Users, Trash2, Edit, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TeamMembersSection } from "./sections/TeamMembersSection";
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
    
    // Optimistically update the UI
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
      
      // Refresh the data to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['participant-team'] });
    } catch (error) {
      // Revert optimistic update on error
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

  const copyTeamCode = () => {
    navigator.clipboard.writeText(team.join_code);
    toast.success("Team code copied to clipboard!");
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Details
          </CardTitle>
          {isLeader && !isLocked && (
            <div className="flex items-center gap-2">
              <Toggle
                pressed={team.status === 'open'}
                onPressedChange={() => handleToggleStatus()}
                disabled={isUpdating}
                className="gap-2 data-[state=on]:bg-green-500"
                aria-label="Toggle team status"
              >
                {team.status === 'draft' ? 'Draft' : 'Open'}
              </Toggle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditTeam}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onDeleteTeam}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Team Details Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{team.name}</h3>
            {team.description && (
              <p className="text-sm text-muted-foreground">
                {team.description}
              </p>
            )}
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <p>Status: {team.status}</p>
              {team.tech_stack && (
                <p>Tech Stack: {team.tech_stack.name}</p>
              )}
              <div className="flex items-center gap-2">
                <p>Team Code: {team.join_code}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyTeamCode}
                  className="h-6 w-6"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p>
                Mentor: {team.mentor_id ? "Assigned" : "Pending Assignment"}
              </p>
            </div>
          </div>

          {/* Team Members Section */}
          <TeamMembersSection
            teamId={team.id}
            isLeader={isLeader}
            isLocked={isLocked}
          />
        </div>
      </CardContent>
    </Card>
  );
}