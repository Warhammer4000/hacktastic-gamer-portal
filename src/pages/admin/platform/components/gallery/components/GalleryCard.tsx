import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { GalleryPost } from "../types";
import { GalleryActions } from "./GalleryActions";

interface GalleryCardProps {
  post: GalleryPost;
  isSelected: boolean;
  onSelect: (postId: string) => void;
  onEdit: (post: GalleryPost) => void;
  onDelete: (postId: string) => void;
  onStatusChange: (postId: string, newStatus: 'draft' | 'published') => void;
}

export function GalleryCard({
  post,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onStatusChange,
}: GalleryCardProps) {
  return (
    <Card>
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(post.id)}
            />
            <div>
              <CardTitle>{post.title}</CardTitle>
              {post.description && (
                <CardDescription>{post.description}</CardDescription>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-[200px] object-cover rounded-md mb-4"
        />
        {post.tags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <GalleryActions
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </CardFooter>
    </Card>
  );
}