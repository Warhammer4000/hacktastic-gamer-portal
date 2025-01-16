import { UserCard } from "@/components/admin/users/UserCard";
import { MentorData } from "../../types/mentor";

interface MentorContentProps {
  mentors: MentorData[];
  onEdit: (mentorId: string) => void;
  onDelete: (mentorId: string) => void;
}

export function MentorContent({ mentors, onEdit, onDelete }: MentorContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mentors?.map((mentor) => (
        <UserCard
          key={mentor.id}
          user={mentor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}