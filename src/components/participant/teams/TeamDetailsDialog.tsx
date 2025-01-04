import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TeamDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  team: {
    name: string;
    description: string | null;
    status: string;
    tech_stack: {
      name: string;
    } | null;
    repository_url: string | null;
  };
}

export function TeamDetailsDialog({ isOpen, onOpenChange, team }: TeamDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
          {team.description && (
            <DialogDescription>
              {team.description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Team Details</h4>
            <p className="text-sm text-muted-foreground">Status: {team.status}</p>
            {team.tech_stack && (
              <p className="text-sm text-muted-foreground">
                Tech Stack: {team.tech_stack.name}
              </p>
            )}
            {team.repository_url && (
              <p className="text-sm text-muted-foreground">
                Repository: <a href={team.repository_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View on GitHub</a>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}