import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { exportParticipants } from "./exportParticipants";

interface ParticipantActionsBarProps {
  onBulkUpload: () => void;
}

export function ParticipantActionsBar({ onBulkUpload }: ParticipantActionsBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={() => exportParticipants()}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export Participants
      </Button>
      <Button 
        variant="outline" 
        onClick={onBulkUpload}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Bulk Upload
      </Button>
    </div>
  );
}