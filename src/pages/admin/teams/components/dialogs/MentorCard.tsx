import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MentorCardProps {
  mentor: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    mentor_tech_stacks: {
      technology_stacks: {
        name: string;
      };
    }[];
    team_count: number;
    max_teams: number;
  };
  isSelected: boolean;
  onSelect: (mentorId: string) => void;
}

export function MentorCard({ mentor, isSelected, onSelect }: MentorCardProps) {
  const initials = mentor.full_name
    ? mentor.full_name.charAt(0).toUpperCase()
    : mentor.email.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "p-4 border rounded-lg mb-2 cursor-pointer transition-colors",
        isSelected ? "border-primary bg-primary/5" : "hover:bg-accent"
      )}
      onClick={() => onSelect(mentor.id)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          {mentor.avatar_url ? (
            <img
              src={mentor.avatar_url}
              alt={mentor.full_name || ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <h4 className="font-medium">
            {mentor.full_name || mentor.email}
          </h4>
          <p className="text-sm text-muted-foreground">{mentor.email}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {mentor.mentor_tech_stacks.map((ts, index) => (
              <span
                key={index}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
              >
                {ts.technology_stacks.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Teams: {mentor.team_count} / {mentor.max_teams}
          </p>
        </div>
      </div>
    </div>
  );
}