import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UserCheck, Lock, Users, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const { data: team } = useQuery({
    queryKey: ['team-details', teamId],
    queryFn: async () => {
      const { data: team, error } = await supabase
        .from('teams')
        .select('leader_id')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      return team;
    },
  });

  const readyMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("Not authenticated");
      const { error } = await supabase
        .from('team_members')
        .update({ is_ready: true })
        .eq('team_id', teamId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      toast.success("Marked as ready!");
    },
    onError: (error) => {
      console.error("Error updating ready status:", error);
      toast.error("Failed to update ready status");
    },
  });

  const leaveTeamMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("Not authenticated");
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Left team successfully");
      navigate('/participant/team');
    },
    onError: (error) => {
      console.error("Error leaving team:", error);
      toast.error("Failed to leave team");
    },
  });

  const handleReadyToggle = () => {
    readyMutation.mutate();
  };

  const handleLeaveTeam = () => {
    if (window.confirm("Are you sure you want to leave this team?")) {
      leaveTeamMutation.mutate();
    }
  };

  const emptySlots = maxMembers - (members?.length || 0);
  const nonLeaderMembers = members?.filter(member => member.user_id !== team?.leader_id) || [];
  const nonLeaderReadyCount = nonLeaderMembers.filter(member => member.is_ready).length;
  const allNonLeaderMembersReady = nonLeaderReadyCount === nonLeaderMembers.length && nonLeaderMembers.length >= 2;
  const currentUserMember = members?.find(member => member.user_id === currentUser?.id);
  const showLockButton = isLeader && !isLocked && allNonLeaderMembersReady && members && members.length >= 2;

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
                {member.user_id === team?.leader_id ? (
                  <Crown className="h-5 w-5 text-yellow-500" />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
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
            {!isLocked && currentUserMember && !currentUserMember.is_ready && !isLeader && (
              <Button
                onClick={handleReadyToggle}
                disabled={isUpdating}
              >
                Mark as Ready
              </Button>
            )}
            {!isLocked && currentUserMember && !isLeader && (
              <Button
                variant="destructive"
                onClick={handleLeaveTeam}
                disabled={isUpdating}
              >
                Leave Team
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