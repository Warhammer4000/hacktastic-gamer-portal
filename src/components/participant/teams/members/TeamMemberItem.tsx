import { Crown, User, UserCheck, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";

interface TeamMemberItemProps {
  userId: string;
  fullName: string | null;
  isLeader: boolean;
  isReady: boolean;
  teamId: string;
  showRemoveButton: boolean;
}

export function TeamMemberItem({ 
  userId, 
  fullName, 
  isLeader, 
  isReady, 
  teamId,
  showRemoveButton 
}: TeamMemberItemProps) {
  const queryClient = useQueryClient();

  const handleRemoveMember = async () => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Immediately invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
      toast.success("Team member kicked successfully");
    } catch (error) {
      console.error('Error kicking team member:', error);
      toast.error("Failed to kick team member");
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center gap-3">
        {isLeader ? (
          <Crown className="h-5 w-5 text-yellow-500" />
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}
        <span>{fullName || 'Unknown User'}</span>
      </div>
      <div className="flex items-center gap-2">
        {isReady && (
          <UserCheck className="h-5 w-5 text-green-500" />
        )}
        {showRemoveButton && !isLeader && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Kick member"
              >
                <Footprints className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kick Team Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to kick {fullName || 'this member'} from the team? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleRemoveMember}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Kick Member
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}