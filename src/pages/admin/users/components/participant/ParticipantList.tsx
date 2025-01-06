import { UserCard } from "@/components/admin/users/UserCard";
import ParticipantTable from "../ParticipantTable";
import { Database } from "@/integrations/supabase/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  user_roles: Database["public"]["Tables"]["user_roles"]["Row"][];
};

interface ParticipantListProps {
  view: "table" | "card";
  participants: Profile[];
  isLoading: boolean;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function ParticipantList({
  view,
  participants,
  isLoading,
  onEdit,
  onDelete,
}: ParticipantListProps) {
  if (view === "table") {
    return (
      <ParticipantTable 
        participants={participants} 
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
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