import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { MentorCard } from "./MentorCard";
import type { MentorWithTeams } from "../types";

interface MentorListProps {
  mentors: MentorWithTeams[] | undefined;
  isLoading: boolean;
  selectedMentorId: string | null;
  onMentorSelect: (mentorId: string) => void;
}

export function MentorList({ 
  mentors, 
  isLoading, 
  selectedMentorId,
  onMentorSelect 
}: MentorListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!mentors?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No mentors found matching the search criteria
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-[400px] pr-4">
      {mentors.map((mentor) => (
        <MentorCard
          key={mentor.id}
          mentor={mentor}
          isSelected={selectedMentorId === mentor.id}
          onSelect={onMentorSelect}
        />
      ))}
    </ScrollArea>
  );
}