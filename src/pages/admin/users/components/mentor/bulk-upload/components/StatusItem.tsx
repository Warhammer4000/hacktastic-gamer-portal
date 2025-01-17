import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { UploadStatus } from "../types/upload";

interface StatusItemProps {
  status: UploadStatus;
}

export function StatusItem({ status }: StatusItemProps) {
  return (
    <div className="flex items-start space-x-2 text-sm">
      {status.status === 'processing' && (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      )}
      {status.status === 'success' && (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      )}
      {status.status === 'failed' && (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <div className="flex-1">
        <p className="font-medium">{status.email}</p>
        {status.error && (
          <p className="text-red-500">{status.error}</p>
        )}
        {status.details && (
          <p className="text-muted-foreground">
            Added {status.details.techStacksAdded} tech stacks
            {status.details.institutionFound && " • Institution found"}
          </p>
        )}
      </div>
    </div>
  );
}