import { Copy, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TeamMentorDetails } from "./TeamMentorDetails";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  teamId: string; // Added teamId to props
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
  teamId, // Added teamId to destructuring
}: TeamDetailsSectionProps) {
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [repositoryUrl, setRepositoryUrl] = useState<string | null>(null);

  const copyTeamCode = () => {
    navigator.clipboard.writeText(joinCode);
    toast.success("Team code copied to clipboard!");
  };

  const handleAssignMentor = async () => {
    try {
      console.log('Attempting to assign mentor...');
      await onAssignMentor();
    } catch (error) {
      console.error('Error in handleAssignMentor:', error);
      toast.error("Failed to assign mentor. Please try again.");
    }
  };

  const createRepository = async () => {
    if (!isLeader || !mentorId) return;
    
    setIsCreatingRepo(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-team-repository', {
        body: { teamId: teamId } // Using teamId from props
      });

      if (error) throw error;

      setRepositoryUrl(data.repository_url);
      toast.success("Repository created successfully!");
    } catch (error) {
      console.error('Error creating repository:', error);
      toast.error("Failed to create repository. Please try again.");
    } finally {
      setIsCreatingRepo(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{name}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <p>Status: {status}</p>
        {techStack && (
          <p>Tech Stack: {techStack.name}</p>
        )}
        <div className="flex items-center gap-2">
          <p>Team Code: {joinCode}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyTeamCode}
            className="h-6 w-6"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        {isLeader && isLocked && !mentorId && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAssignMentor}
            className="mt-2"
          >
            Assign Mentor
          </Button>
        )}

        {isLeader && mentorId && status === 'active' && !repositoryUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={createRepository}
            disabled={isCreatingRepo}
            className="mt-2 gap-2"
          >
            <Github className="h-4 w-4" />
            Create Team Repository
          </Button>
        )}

        {repositoryUrl && (
          <div className="mt-2">
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View Repository
            </a>
          </div>
        )}
      </div>
      
      <TeamMentorDetails mentorId={mentorId} />
    </div>
  );
}