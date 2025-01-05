import { useState } from "react";
import { Users, Trash2, Edit, Copy, ToggleLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TeamMembersSection } from "./sections/TeamMembersSection";
import { supabase } from "@/integrations/supabase/client";

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

  const handleToggleStatus = async () => {
    if (!isLeader || isLocked) return;
    
    setIsUpdating(true);
    try {
      const newStatus = team.status === 'draft' ? 'open' : 'draft';
      const { error } = await supabase
        .from('teams')
        .update({ status: newStatus })
        .eq('id', team.id);

      if (error) throw error;
      toast.success(`Team is now ${newStatus}`);
    } catch (error) {
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
          <CardTitle>My Team</CardTitle>
          {isLeader && !isLocked && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleStatus}
                disabled={isUpdating}
                className="gap-2"
              >
                <ToggleLeft className={`h-4 w-4 ${team.status === 'open' ? 'text-green-500' : 'text-muted-foreground'}`} />
                {team.status === 'draft' ? 'Draft' : 'Open'}
              </Button>
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