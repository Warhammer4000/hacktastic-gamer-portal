import { UserCard } from "@/components/admin/users/UserCard";
import { Database } from "@/integrations/supabase/types/database";
import { Loader2 } from "lucide-react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  user_roles: Database["public"]["Tables"]["user_roles"]["Row"][];
  institutions?: {
    name: string;
    type: string;
  } | null;
};

interface ParticipantListProps {
  participants: Profile[];
  isLoading: boolean;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function ParticipantList({
  participants,
  isLoading,
  onEdit,
  onDelete,
}: ParticipantListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!participants?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No participants found matching the search criteria
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {participants.map((participant) => (
        <UserCard
          key={participant.id}
          user={participant}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}