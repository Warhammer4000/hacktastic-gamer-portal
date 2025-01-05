import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMemberActionsProps {
  isLocked: boolean;
  isLeader: boolean;
  isReady: boolean;
  showLockButton: boolean;
  onReadyToggle: () => void;
  onLeaveTeam: () => Promise<void>;
  onLockTeam: () => void;
  isUpdating: boolean;
}

export function TeamMemberActions({
  isLocked,
  isLeader,
  isReady,
  showLockButton,
  onReadyToggle,
  onLeaveTeam,
  onLockTeam,
  isUpdating
}: TeamMemberActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      {!isLocked && !isReady && !isLeader && (
        <Button
          onClick={onReadyToggle}
          disabled={isUpdating}
        >
          Mark as Ready
        </Button>
      )}
      {!isLocked && !isLeader && (
        <Button
          variant="destructive"
          onClick={onLeaveTeam}
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
          disabled={isUpdating}
        >
          <Lock className="h-4 w-4" />
          Lock Team
        </Button>
      )}
    </div>
  );
}