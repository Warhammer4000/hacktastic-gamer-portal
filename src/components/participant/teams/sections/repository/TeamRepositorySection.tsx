import { useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TeamRepositorySectionProps {
  teamId: string;
  isLeader: boolean;
  mentorId: string | null;
  repositoryUrl: string | null;
}

export function TeamRepositorySection({
  teamId,
  isLeader,
  mentorId,
  repositoryUrl,
}: TeamRepositorySectionProps) {
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);

  const createRepository = async () => {
    if (!isLeader || !mentorId) return;
    
    setIsCreatingRepo(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-team-repository', {
        body: { teamId }
      });

      if (error) throw error;
      toast.success("Repository created successfully!");
    } catch (error) {
      console.error('Error creating repository:', error);
      toast.error("Failed to create repository. Please try again.");
    } finally {
      setIsCreatingRepo(false);
    }
  };

  if (!mentorId || !isLeader) return null;

  return (
    <div className="mt-4">
      {!repositoryUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={createRepository}
          disabled={isCreatingRepo}
          className="gap-2"
        >
          <Github className="h-4 w-4" />
          Create Team Repository
        </Button>
      )}

      {repositoryUrl && (
        <a
          href={repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <Github className="h-4 w-4" />
          View Repository
        </a>
      )}
    </div>
  );
}