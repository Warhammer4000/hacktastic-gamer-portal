import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

interface TeamMembersListProps {
  members?: Array<{
    id: string;
    user_id: string;
    profiles?: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }>;
}

export function TeamMembersList({ members }: TeamMembersListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4">
        <Users className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Team Members</h2>
      </div>
      <Separator className="mb-4" />
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {member.profiles?.avatar_url ? (
                  <img
                    src={member.profiles.avatar_url}
                    alt={member.profiles.full_name || ""}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {member.profiles?.full_name?.[0] || "?"}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">
                {member.profiles?.full_name || "Unknown User"}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}