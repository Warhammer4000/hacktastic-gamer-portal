import { Edit, Trash, CheckSquare, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryActionButtonsProps } from "../types";

export function GalleryActions({ post, onEdit, onDelete, onStatusChange }: GalleryActionButtonsProps) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(post)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(post.id)}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onStatusChange(
          post.id, 
          post.status === 'published' ? 'draft' : 'published'
        )}
      >
        {post.status === 'published' ? (
          <>
            <XSquare className="h-4 w-4 mr-2" />
            Unpublish
          </>
        ) : (
          <>
            <CheckSquare className="h-4 w-4 mr-2" />
            Publish
          </>
        )}
      </Button>
    </div>
  );
}