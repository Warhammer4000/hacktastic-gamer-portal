import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
}

export function BulkActions({ 
  selectedCount, 
  onApproveSelected, 
  onRejectSelected 
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex gap-2">
      <Button onClick={onApproveSelected} variant="default">
        <CheckCircle className="mr-2" />
        Approve Selected ({selectedCount})
      </Button>
      <Button onClick={onRejectSelected} variant="destructive">
        <XCircle className="mr-2" />
        Reject Selected ({selectedCount})
      </Button>
    </div>
  );
}