import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, UserCheck, Lock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface TeamMembersCardProps {
  teamId: string;
  maxMembers: number;
  isLeader: boolean;
  isLocked: boolean;
  onLockTeam: () => void;
}

export function TeamMembersCard({ 
  teamId, 
  maxMembers, 
  isLeader,
  isLocked,
  onLockTeam 
}: TeamMembersCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: async () => {
      const { data: members, error } = await supabase
        .from('team_members')
        .select(`
          id,
          is_ready,
          user_id,
          profile:profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      return members;
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const handleReadyToggle = async () => {
    if (!currentUser) return;

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('team_members')
        .update({ is_ready: true })
        .eq('team_id', teamId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
      toast.success("Ready status updated!");
    } catch (error) {
      console.error("Error updating ready status:", error);
      toast.error("Failed to update ready status");
    } finally {
      setIsUpdating(false);
    }
  };

  const emptySlots = maxMembers - (members?.length || 0);
  const allMembersReady = members?.every(member => member.is_ready) || false;
  const currentUserMember = members?.find(member => member.user_id === currentUser?.id);
  const showLockButton = isLeader && !isLocked && allMembersReady && members && members.length >= 2;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{member.profile?.full_name || 'Unknown User'}</span>
              </div>
              {member.is_ready && (
                <UserCheck className="h-5 w-5 text-green-500" />
              )}
            </div>
          ))}

          {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-dashed"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Empty Slot</span>
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            {!isLocked && currentUserMember && !currentUserMember.is_ready && (
              <Button
                onClick={handleReadyToggle}
                disabled={isUpdating}
              >
                Mark as Ready
              </Button>
            )}
            {showLockButton && (
              <Button
                variant="default"
                onClick={onLockTeam}
                className="gap-2"
              >
                <Lock className="h-4 w-4" />
                Lock Team
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}