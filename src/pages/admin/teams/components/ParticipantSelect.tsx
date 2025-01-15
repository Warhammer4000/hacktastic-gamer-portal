import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvailableParticipants } from "../hooks/useAvailableParticipants";

interface ParticipantSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  teamId: string;
  teamMembers?: any[];
}

export function ParticipantSelect({ 
  value, 
  onValueChange, 
  teamId,
  teamMembers = [] 
}: ParticipantSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: participants, isLoading } = useAvailableParticipants(teamId, teamMembers);

  const filteredParticipants = participants?.filter(participant => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (participant?.full_name?.toLowerCase() || "").includes(searchLower) ||
      (participant?.email?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="relative">
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading participants...
            </div>
          ) : filteredParticipants?.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No participants found
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {filteredParticipants?.map((participant) => (
                <button
                  key={participant.id}
                  type="button"
                  onClick={() => onValueChange(participant.id)}
                  className={`w-full p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors
                    ${value === participant.id ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={participant.avatar_url || ''} alt={participant.full_name || ''} />
                      <AvatarFallback>
                        {participant.full_name?.[0] || participant.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium">{participant.full_name || 'Unnamed'}</span>
                      <span className="text-sm text-muted-foreground">
                        {participant.institution?.name || 'No institution'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}