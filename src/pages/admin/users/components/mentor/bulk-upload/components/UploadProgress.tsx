import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { UploadProgress as UploadProgressType } from "../types/upload";

interface UploadProgressProps {
  progress: UploadProgressType;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  const percentage = progress.total > 0 
    ? Math.round((progress.processed / progress.total) * 100)
    : 0;

  const getEstimatedTime = () => {
    if (!progress.startTime || progress.processed === 0) return "Calculating...";
    
    const elapsed = Date.now() - progress.startTime.getTime();
    const timePerItem = elapsed / progress.processed;
    const remaining = (progress.total - progress.processed) * timePerItem;
    
    return `${Math.ceil(remaining / 1000)}s remaining`;
  };

  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Processing {progress.processed} of {progress.total}</span>
        <span>{getEstimatedTime()}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      {progress.currentEmail && (
        <p className="text-sm text-muted-foreground">
          Current: {progress.currentEmail}
        </p>
      )}
    </Card>
  );
}