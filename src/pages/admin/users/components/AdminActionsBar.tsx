import { Button } from "@/components/ui/button";
import { UserPlus, Upload } from "lucide-react";

interface AdminActionsBarProps {
  onAddAdmin: () => void;
  onBulkUpload: () => void;
}

export default function AdminActionsBar({ onAddAdmin, onBulkUpload }: AdminActionsBarProps) {
  return (
    <div className="space-x-2">
      <Button onClick={onAddAdmin}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Administrator
      </Button>
      <Button variant="outline" onClick={onBulkUpload}>
        <Upload className="mr-2 h-4 w-4" />
        Bulk Upload
      </Button>
    </div>
  );
}