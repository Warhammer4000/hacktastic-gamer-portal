import { UserCard } from "@/components/admin/users/UserCard";
import { MentorTable } from "./MentorTable";
import { MentorData } from "../../types/mentor";

interface MentorContentProps {
  view: "table" | "card";
  mentors: MentorData[];
  onEdit: (mentorId: string) => void;
  onDelete: (mentorId: string) => void;
}

export function MentorContent({ view, mentors, onEdit, onDelete }: MentorContentProps) {
  if (view === "table") {
    return (
      <MentorTable 
        mentors={mentors} 
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

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