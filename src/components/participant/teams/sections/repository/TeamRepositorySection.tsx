import { useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import Confetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const queryClient = useQueryClient();

  const createRepository = async () => {
    if (!isLeader || !mentorId) return;
    
    setIsCreatingRepo(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-team-repository', {
        body: { teamId }
      });

      if (error) throw error;
      
      // Update team status to active
      const { error: updateError } = await supabase
        .from('teams')
        .update({ status: 'active' })
        .eq('id', teamId);

      if (updateError) throw updateError;

      // Show success animations and messages
      setShowConfetti(true);
      setShowCongrats(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      // Invalidate the team query to refresh the repository URL
      queryClient.invalidateQueries({ queryKey: ['participant-team'] });
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
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

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
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Repository:</p>
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-2 text-sm"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      )}

      <Dialog open={showCongrats} onOpenChange={setShowCongrats}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations! 🎉</DialogTitle>
            <DialogDescription className="pt-4">
              Your team repository has been created successfully and your team is now active! 
              You can now start collaborating with your team members and mentor through GitHub.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}