import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
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
  published_at: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type NewsCardProps = {
  post: NewsPost;
};

export function NewsCard({ post }: NewsCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        <CardDescription>
          Published on {format(new Date(post.published_at || post.created_at), "PPP")}
          {post.profiles?.full_name && ` by ${post.profiles.full_name}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div 
          className="prose dark:prose-invert line-clamp-3 mb-4 flex-1"
          dangerouslySetInnerHTML={{ 
            __html: post.content 
          }} 
        />
        <div className="space-y-4">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <Link
            to={`/public/news/${post.id}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Read more <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}