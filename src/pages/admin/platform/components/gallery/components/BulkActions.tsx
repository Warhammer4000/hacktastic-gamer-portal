import { CheckSquare, Trash, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BulkActionsProps } from "../types";

export function BulkActions({ selectedPosts, onPublish, onUnpublish, onDelete }: BulkActionsProps) {
  if (selectedPosts.length === 0) return null;

  return (
    <div className="flex gap-2 items-center bg-muted p-4 rounded-lg">
      <span className="text-sm font-medium">
        {selectedPosts.length} items selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onPublish}
      >
        <CheckSquare className="h-4 w-4 mr-2" />
        Publish Selected
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onUnpublish}
      >
        <XSquare className="h-4 w-4 mr-2" />
        Unpublish Selected
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
}