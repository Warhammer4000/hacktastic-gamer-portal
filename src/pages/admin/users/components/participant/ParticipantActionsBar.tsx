import { Button } from "@/components/ui/button";
import { UserPlus, Upload } from "lucide-react";

interface ParticipantActionsBarProps {
  onAddParticipant: () => void;
  onBulkUpload: () => void;
}

export function ParticipantActionsBar({
  onAddParticipant,
  onBulkUpload,
}: ParticipantActionsBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="space-x-2">
        <Button onClick={onAddParticipant}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Participant
        </Button>
        <Button variant="outline" onClick={onBulkUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </div>
    </div>
  );
}