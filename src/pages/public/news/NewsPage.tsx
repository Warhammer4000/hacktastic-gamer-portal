import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "./components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/landing/Navbar";

export default function NewsPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["public-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select(`
          id,
          title,
          content,
          tags,
          published_at,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container py-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-8 space-y-6">
        <h1 className="text-3xl font-bold">Latest News</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}