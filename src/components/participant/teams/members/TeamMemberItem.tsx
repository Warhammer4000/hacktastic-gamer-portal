import { Crown, User, UserCheck } from "lucide-react";

interface TeamMemberItemProps {
  userId: string;
  fullName: string | null;
  isLeader: boolean;
  isReady: boolean;
}

export function TeamMemberItem({ userId, fullName, isLeader, isReady }: TeamMemberItemProps) {
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
      {isReady && (
        <UserCheck className="h-5 w-5 text-green-500" />
      )}
    </div>
  );
}