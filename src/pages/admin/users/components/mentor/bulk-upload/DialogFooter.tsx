import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DialogFooterProps {
  onClose: () => void;
  isUploading: boolean;
  file: File | null;
  onUpload: () => void;
}

export function DialogFooter({ onClose, isUploading, file, onUpload }: DialogFooterProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isUploading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={!file || isUploading}
        onClick={onUpload}
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