import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ParticipantActionsBarProps {
  onBulkUpload: () => void;
}

export function ParticipantActionsBar({
  onBulkUpload,
}: ParticipantActionsBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="space-x-2">
        <Button variant="outline" onClick={onBulkUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </div>
    </div>
  );
}