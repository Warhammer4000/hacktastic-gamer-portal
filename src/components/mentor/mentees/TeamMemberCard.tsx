import { Mail, School, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SocialLinks } from "./SocialLinks";

interface TeamMemberCardProps {
  member: {
    id: string;
    is_ready: boolean;
    profile: {
      id: string;
      full_name: string | null;
      email: string;
      avatar_url: string | null;
      github_username: string | null;
      linkedin_profile_id: string | null;
      institution: {
        name: string;
      } | null;
    } | null;
  };
  isLeader: boolean;
}

export function TeamMemberCard({ member, isLeader }: TeamMemberCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={member.profile?.avatar_url || ""}
            alt={member.profile?.full_name || "Team Member"}
          />
          <AvatarFallback>
            {member.profile?.full_name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {member.profile?.full_name || "Unknown User"}
            </h3>
            {isLeader && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" />
                Leader
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {member.profile?.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {member.profile.email}
                </span>
              </div>
            )}
            {member.profile?.institution && (
              <div className="flex items-center gap-1">
                <School className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {member.profile.institution.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <SocialLinks
        githubUsername={member.profile?.github_username}
        linkedinProfileId={member.profile?.linkedin_profile_id}
      />
    </div>
  );
}