import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MentorWithTeams } from "../types";

interface MentorCardProps {
  mentor: MentorWithTeams;
  isSelected: boolean;
  onSelect: (mentorId: string) => void;
  isCurrentMentor?: boolean;
}

export function MentorCard({ mentor, isSelected, onSelect, isCurrentMentor }: MentorCardProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start text-left h-auto p-4 space-y-2",
        isSelected && "border-primary",
        isCurrentMentor && "bg-muted"
      )}
      onClick={() => onSelect(mentor.id)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.full_name || ''} />
          <AvatarFallback>
            {mentor.full_name?.[0] || mentor.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {mentor.full_name || mentor.email}
            </span>
            {isCurrentMentor && (
              <Badge variant="secondary" className="text-xs">Current Mentor</Badge>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {mentor.team_count} / {mentor.max_teams} teams assigned
          </div>

          <div className="flex flex-wrap gap-1">
            {mentor.mentor_tech_stacks?.map((stack) => (
              <Badge 
                key={stack.technology_stacks.name} 
                variant="secondary"
                className="text-xs"
              >
                {stack.technology_stacks.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Button>
  );
}