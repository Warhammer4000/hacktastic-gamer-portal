import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Blocks, User, Users, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamInfoProps {
  description?: string;
  techStack?: {
    icon_url?: string;
    name: string;
  };
  leader?: {
    avatar_url?: string;
    full_name?: string;
  };
  teamMembers: any[];
  maxMembers: number;
  mentor?: {
    avatar_url?: string;
    full_name?: string;
    linkedin_profile_id?: string;
  };
  repositoryUrl?: string;
}

export function TeamInfo({
  description,
  techStack,
  leader,
  teamMembers,
  maxMembers,
  mentor,
  repositoryUrl,
}: TeamInfoProps) {
  return (
    <div className="grid gap-6">
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Blocks className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              {techStack?.icon_url && (
                <Avatar className="h-5 w-5">
                  <AvatarImage src={techStack.icon_url} alt={techStack.name} />
                  <AvatarFallback>{techStack.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm font-medium">
                {techStack?.name || "Not specified"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              {leader?.avatar_url && (
                <Avatar className="h-5 w-5">
                  <AvatarImage src={leader.avatar_url} alt={leader.full_name || ''} />
                  <AvatarFallback>{leader.full_name?.[0] || 'L'}</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm font-medium">
                {leader?.full_name || "Unknown Leader"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {teamMembers?.length || 0} / {maxMembers || 3} Members
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {mentor && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  {mentor.avatar_url && (
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={mentor.avatar_url} alt={mentor.full_name || ''} />
                      <AvatarFallback>{mentor.full_name?.[0] || 'M'}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-sm font-medium">{mentor.full_name}</span>
                </div>
              </div>
              
              {mentor.linkedin_profile_id && (
                <Button variant="ghost" size="sm" className="h-8 pl-7" asChild>
                  <a
                    href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                  </a>
                </Button>
              )}
            </div>
          )}

          {repositoryUrl && (
            <Button variant="ghost" size="sm" className="h-8 pl-7" asChild>
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Github className="h-4 w-4" />
                View Repository
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}