import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NewsPost = {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  status: 'draft' | 'published';
  created_at: string;
  published_at: string | null;
};

type NewsCardProps = {
  post: NewsPost;
  onEdit: (post: NewsPost) => void;
  onDelete: (post: NewsPost) => void;
  onPreview: (post: NewsPost) => void;
};

export function NewsCard({ post, onEdit, onDelete, onPreview }: NewsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              Created on {format(new Date(post.created_at), 'PPP')}
              {post.published_at && ` • Published on ${format(new Date(post.published_at), 'PPP')}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onPreview(post)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onEdit(post)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onDelete(post)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert line-clamp-2 mb-4">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
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
    </Card>
  );
}