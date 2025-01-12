import { useState } from "react";
import { Search, UserMinus, UserPlus } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  maxMembers = 4,
  isLocked = false,
}: TeamMemberManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = availableParticipants.filter(participant => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = participant?.full_name?.toLowerCase() || "";
    const email = participant?.email?.toLowerCase() || "";
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        {!isLocked && teamMembers.length < maxMembers && (
          <div className="border rounded-lg p-4">
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Search participants..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              {filteredParticipants.length === 0 ? (
                <CommandEmpty>No participants found.</CommandEmpty>
              ) : (
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {filteredParticipants.map((participant) => (
                    <CommandItem
                      key={participant.id}
                      onSelect={() => onMemberAdd(participant.id)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span>{participant.full_name || participant.email}</span>
                      </div>
                      <UserPlus className="h-4 w-4 shrink-0 opacity-50" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </Command>
          </div>
        )}
      </CardContent>
    </Card>
  );
}