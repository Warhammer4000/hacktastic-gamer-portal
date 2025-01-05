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
}

export function TeamDetailsSection({
  name,
  description,
  status,
  techStack,
  joinCode,
  mentorId,
}: TeamDetailsSectionProps) {
  const copyTeamCode = () => {
    navigator.clipboard.writeText(joinCode);
    toast.success("Team code copied to clipboard!");
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
        <p>
          Mentor: {mentorId ? "Assigned" : "Pending Assignment"}
        </p>
      </div>
    </div>
  );
}