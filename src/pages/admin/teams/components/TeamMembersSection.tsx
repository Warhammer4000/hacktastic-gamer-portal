import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TeamMemberSelect } from "../TeamMemberSelect";
import { Button } from "@/components/ui/button";

interface TeamMembersSectionProps {
  teamMembers: Array<{
    user_id: string;
    profile: {
      full_name: string | null;
      email: string;
    };
  }>;
  participants: Array<{
    id: string;
    full_name: string | null;
    email: string;
  }> | null;
  isLoadingParticipants: boolean;
  selectedMemberId: string;
  onMemberSelect: (value: string) => void;
  onRemoveMember: (memberId: string) => void;
  leaderId: string;
}

export function TeamMembersSection({
  teamMembers,
  participants,
  isLoadingParticipants,
  selectedMemberId,
  onMemberSelect,
  onRemoveMember,
  leaderId,
}: TeamMembersSectionProps) {
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

  const maxMembers = teamSettings?.max_team_size || 3;
  const canAddMoreMembers = teamMembers.length < maxMembers;

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <Label>Team Members</Label>
        <div className="space-y-4">
          {teamMembers?.map((member) => (
            <div key={member.user_id} className="flex items-center justify-between">
              <span>{member.profile.full_name || member.profile.email}</span>
              {member.user_id !== leaderId && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveMember(member.user_id)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        {canAddMoreMembers && (
          <div className="space-y-2">
            <Label>Add Team Member</Label>
            <TeamMemberSelect
              value={selectedMemberId}
              onValueChange={onMemberSelect}
              participants={participants || []}
              isLoading={isLoadingParticipants}
            />
          </div>
        )}
      </div>
    </>
  );
}