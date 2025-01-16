import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { UploadSummary as UploadSummaryType } from "../types/upload";

interface UploadSummaryProps {
  summary: UploadSummaryType;
  onExportFailed: () => void;
}

export function UploadSummary({ summary, onExportFailed }: UploadSummaryProps) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium">Total</p>
          <p className="text-2xl">{summary.total}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-green-600">Successful</p>
          <p className="text-2xl">{summary.successful}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-destructive">Failed</p>
          <p className="text-2xl">{summary.failed}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Processed in {(summary.processingTime / 1000).toFixed(1)}s
        </p>
        {summary.failed > 0 && (
          <Button variant="outline" size="sm" onClick={onExportFailed}>
            <Download className="h-4 w-4 mr-2" />
            Export Failed
          </Button>
        )}
      </div>
    </Card>
  );
}