import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DialogFooterProps {
  onClose: () => void;
  isUploading: boolean;
  file: File | null;
}

export function DialogFooter({ onClose, isUploading, file }: DialogFooterProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!file || isUploading}
      >
        {isUploading ? (
          "Uploading..."
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </>
        )}
      </Button>
    </div>
  );
}