import { memo } from "react";
import { UserCard } from "@/components/admin/users/UserCard";
import { MentorData } from "../../types/mentor";

interface MentorContentProps {
  mentors: MentorData[];
  onEdit: (mentorId: string) => void;
  onDelete: (mentorId: string) => void;
  isLoading: boolean;
}

// Memoize the individual MentorCard component
const MemoizedUserCard = memo(UserCard);

export function MentorContent({ mentors, onEdit, onDelete, isLoading }: MentorContentProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mentors?.map((mentor) => (
        <MemoizedUserCard
          key={mentor.id}
          user={mentor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}