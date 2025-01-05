import { Crown, User, UserCheck, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const handleRemoveMember = async () => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) throw error;
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
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveMember}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Kick member"
          >
            <Footprints className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}