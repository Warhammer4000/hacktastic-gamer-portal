import { Progress } from "@/components/ui/progress";
import { UploadProgress as UploadProgressType } from "../types/upload";

interface UploadProgressProps {
  progress: UploadProgressType;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  const percentage = (progress.processed / progress.total) * 100;

  return (
    <div className="space-y-2">
      <Progress value={percentage} />
      <p className="text-sm text-muted-foreground">
        Processing {progress.processed} of {progress.total} mentors
        {progress.currentEmail && (
          <span className="block">Current: {progress.currentEmail}</span>
        )}
      </p>
    </div>
  );
}