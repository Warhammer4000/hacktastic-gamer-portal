import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type NewsHeaderProps = {
  onAddPost: () => void;
  onBulkUpload: () => void;
};

export function NewsHeader({ onAddPost, onBulkUpload }: NewsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">News Posts</h2>
      <div className="flex gap-2">
        <Button size="sm" onClick={onBulkUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
        <Button size="sm" onClick={onAddPost}>
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>
    </div>
  );
}