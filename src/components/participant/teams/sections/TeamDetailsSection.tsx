import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
}: TeamDetailsSectionProps) {
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
        <div className="flex items-center gap-2">
          <p>Mentor: {mentorId ? "Assigned" : "Not Assigned"}</p>
          {isLeader && isLocked && !mentorId && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAssignMentor}
            >
              Assign Mentor
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}