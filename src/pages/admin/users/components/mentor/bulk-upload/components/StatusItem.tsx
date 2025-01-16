import { Check, X, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadStatus } from "../types/upload";

interface StatusItemProps {
  status: UploadStatus;
}

export function StatusItem({ status }: StatusItemProps) {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn(
      "flex items-start gap-3 p-2 rounded-lg",
      status.status === 'failed' && "bg-destructive/10"
    )}>
      <div className="mt-1">{getStatusIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{status.email}</p>
        {status.error && (
          <p className="text-sm text-destructive mt-1">{status.error}</p>
        )}
        {status.details && status.status === 'success' && (
          <p className="text-sm text-muted-foreground mt-1">
            Added {status.details.techStacksAdded} tech stack(s)
          </p>
        )}
      </div>
    </div>
  );
}