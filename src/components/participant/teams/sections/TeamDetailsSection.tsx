import { Copy, Github, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TeamMentorDetails } from "./TeamMentorDetails";
import { TeamRepositorySection } from "./repository/TeamRepositorySection";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeamDetailsSectionProps {
  name: string;
  description: string | null;
  status: string;
  techStack: {
    name: string;
    icon_url: string;
  } | null;
  joinCode: string;
  mentorId: string | null;
  isLeader: boolean;
  isLocked: boolean;
  onAssignMentor: () => Promise<void>;
  teamId: string;
  repositoryUrl: string | null;
}

export function TeamDetailsSection({
  name,
  description,
  status,
  techStack,
  joinCode,
  mentorId,
  isLeader,
  isLocked,
  onAssignMentor,
  teamId,
  repositoryUrl,
}: TeamDetailsSectionProps) {
  const copyTeamCode = () => {
    navigator.clipboard.writeText(joinCode);
    toast.success("Team code copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'locked':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_mentor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{name}</h3>
          <Badge className={getStatusColor(status)}>
            {status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Team Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tech Stack Info */}
        <div className="space-y-2 p-4 rounded-lg border">
          <h4 className="font-medium text-sm text-muted-foreground">Tech Stack</h4>
          <div className="flex items-center gap-2">
            {techStack?.icon_url && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={techStack.icon_url} alt={techStack.name} />
                <AvatarFallback>{techStack.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <p className="font-medium">
              {techStack?.name || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Team Code */}
        <div className="space-y-2 p-4 rounded-lg border">
          <h4 className="font-medium text-sm text-muted-foreground">Team Code</h4>
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded">{joinCode}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyTeamCode}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Repository Section */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Github className="h-5 w-5" />
          Repository
        </h4>
        <TeamRepositorySection
          teamId={teamId}
          isLeader={isLeader}
          mentorId={mentorId}
          repositoryUrl={repositoryUrl}
        />
      </div>

      {/* Mentor Section */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Mentor
        </h4>
        {isLeader && isLocked && !mentorId && (
          <Button 
            variant="outline" 
            onClick={onAssignMentor}
            className="w-full mb-4"
          >
            Assign Mentor
          </Button>
        )}
        <TeamMentorDetails mentorId={mentorId} />
      </div>
    </div>
  );
}