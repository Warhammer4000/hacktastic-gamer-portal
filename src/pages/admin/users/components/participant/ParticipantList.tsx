import { UserCard } from "@/components/admin/users/UserCard";
import { DeleteUserDialog } from "../DeleteUserDialog";
import { useParticipantActions } from "./useParticipantActions";
import { ProfilesTable } from "@/integrations/supabase/types/tables/profiles";

interface ParticipantListProps {
  participants: (ProfilesTable["Row"] & {
    institutions?: {
      name: string;
      type: string;
    } | null;
  })[];
  isLoading: boolean;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function ParticipantList({ participants, isLoading, onEdit, onDelete }: ParticipantListProps) {
  const { handleDelete, confirmDelete, isDeleteDialogOpen, setIsDeleteDialogOpen } = useParticipantActions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {participants.map((participant) => (
        <UserCard
          key={participant.id}
          user={participant}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        userType="participant"
      />
    </div>
  );
}