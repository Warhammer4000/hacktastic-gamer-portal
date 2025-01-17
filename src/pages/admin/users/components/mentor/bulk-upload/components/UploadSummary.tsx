import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { UploadSummary as UploadSummaryType } from "../types/upload";

interface UploadSummaryProps {
  summary: UploadSummaryType;
  onExportFailed: () => void;
}

export function UploadSummary({ summary, onExportFailed }: UploadSummaryProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-4">
        <h4 className="font-medium">Upload Summary</h4>
        <div className="mt-2 space-y-1">
          <p className="text-sm">Total processed: {summary.total}</p>
          <p className="text-sm text-green-600">Successful: {summary.successful}</p>
          <p className="text-sm text-red-600">Failed: {summary.failed}</p>
          <p className="text-sm text-muted-foreground">
            Processing time: {formatTime(summary.processingTime)}
          </p>
        </div>
      </div>
      
      {summary.failed > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onExportFailed}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Failed Entries
        </Button>
      )}
    </div>
  );
}