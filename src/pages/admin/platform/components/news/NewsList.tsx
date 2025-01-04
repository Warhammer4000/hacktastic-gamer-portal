import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

type NewsPost = {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  status: 'draft' | 'published';
  created_at: string;
  published_at: string | null;
};

type Props = {
  posts: NewsPost[];
  isLoading: boolean;
};

export function NewsList({ posts, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No news posts found
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <Card key={post.id}>
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
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
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
      ))}
    </div>
  );
}