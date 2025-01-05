import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface TeamHeaderActionsProps {
  isLeader: boolean;
  isLocked: boolean;
  status: string;
  isUpdating: boolean;
  onStatusToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TeamHeaderActions({
  isLeader,
  isLocked,
  status,
  isUpdating,
  onStatusToggle,
  onEdit,
  onDelete,
}: TeamHeaderActionsProps) {
  // Don't show any actions if not leader or if team is locked
  if (!isLeader || isLocked || status === 'active' || status === 'pending_mentor') return null;

  const showToggle = status === 'draft' || status === 'open';

  return (
    <div className="flex items-center gap-2">
      {showToggle && (
        <Toggle
          pressed={status === 'open'}
          onPressedChange={onStatusToggle}
          disabled={isUpdating}
          className="gap-2 data-[state=on]:bg-green-500"
          aria-label="Toggle team status"
        >
          {status === 'draft' ? 'Draft' : 'Open'}
        </Toggle>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="gap-2"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={onDelete}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}