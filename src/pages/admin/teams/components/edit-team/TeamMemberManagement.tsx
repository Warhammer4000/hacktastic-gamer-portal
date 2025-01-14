import { useState } from "react";
import { UserMinus, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/participant/teams/components/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TeamMember } from "./types";

interface TeamMemberManagementProps {
  teamMembers: TeamMember[];
  availableParticipants: Array<{
    id: string;
    full_name: string | null;
    email: string;
  }>;
  leaderId: string;
  onMemberAdd: (memberId: string) => void;
  onMemberRemove: (memberId: string) => void;
  onLeaderChange: (memberId: string) => void;
  maxMembers?: number;
  isLocked?: boolean;
}

export function TeamMemberManagement({
  teamMembers = [],
  availableParticipants = [],
  leaderId,
  onMemberAdd,
  onMemberRemove,
  onLeaderChange,
  maxMembers,
  isLocked = false,
}: TeamMemberManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: teamSettings } = useQuery({
    queryKey: ['team-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const effectiveMaxMembers = maxMembers || teamSettings?.max_team_size || 3;

  const filteredParticipants = availableParticipants.filter(participant => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = participant?.full_name?.toLowerCase() || "";
    const email = participant?.email?.toLowerCase() || "";
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto">
        {/* Current Members */}
        <div className="space-y-4">
          <RadioGroup
            value={leaderId}
            onValueChange={onLeaderChange}
            className="space-y-2"
            disabled={isLocked}
          >
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between space-x-2 p-2 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={member.user_id} id={`leader-${member.user_id}`} />
                  <Label htmlFor={`leader-${member.user_id}`} className="flex-1">
                    {member.profile.full_name || member.profile.email}
                  </Label>
                </div>
                {!isLocked && member.user_id !== leaderId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMemberRemove(member.user_id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Add Members */}
        {!isLocked && teamMembers.length < effectiveMaxMembers && (
          <div className="border rounded-lg p-4 space-y-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search participants..."
            />
            
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {filteredParticipants.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No participants found.</p>
              ) : (
                filteredParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <span className="text-sm">
                      {participant.full_name || participant.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMemberAdd(participant.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}