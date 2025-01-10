import { UserCard } from "@/components/admin/users/UserCard";
import { Database } from "@/integrations/supabase/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  user_roles: Database["public"]["Tables"]["user_roles"]["Row"][];
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
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {participants?.map((participant) => (
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