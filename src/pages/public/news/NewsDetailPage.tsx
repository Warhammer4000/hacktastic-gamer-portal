import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsDetailPage() {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["news-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button asChild>
          <Link to="/public/news">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <Button asChild variant="outline">
        <Link to="/public/news">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
        </Link>
      </Button>
      
      <article className="prose dark:prose-invert lg:prose-lg mx-auto">
        <h1>{post.title}</h1>
        
        <div className="flex items-center gap-4 not-prose">
          <p className="text-sm text-muted-foreground">
            Published on {format(new Date(post.published_at || post.created_at), "PPP")}
            {post.profiles?.full_name && ` by ${post.profiles.full_name}`}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}