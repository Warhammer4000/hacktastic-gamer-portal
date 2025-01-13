import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogFooterProps {
  onClose: () => void;
  onAutoAssign: () => void;
  onManualAssign: () => void;
  isAssigning: boolean;
  hasSelectedMentor: boolean;
}

export function DialogFooter({
  onClose,
  onAutoAssign,
  onManualAssign,
  isAssigning,
  hasSelectedMentor,
}: DialogFooterProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="outline"
        onClick={onAutoAssign}
        disabled={isAssigning}
      >
        {isAssigning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Auto-Assigning...
          </>
        ) : (
          "Auto-Assign"
        )}
      </Button>
      <Button
        onClick={onManualAssign}
        disabled={isAssigning || !hasSelectedMentor}
      >
        {isAssigning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Assigning...
          </>
        ) : (
          "Assign Selected"
        )}
      </Button>
    </div>
  );
}