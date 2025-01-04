import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SortDesc, SortAsc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/landing/Navbar";
import type { GalleryPost } from "@/pages/admin/platform/components/gallery/types";

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["gallery-posts", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_posts")
        .select("*")
        .eq('status', 'published')
        .order("created_at", { ascending: sortOrder === "asc" });

      if (error) throw error;
      return data as GalleryPost[];
    },
  });

  const filteredPosts = posts?.filter((post) => {
    const matchesTags = post.tags?.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesTitle = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDescription = post.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTags || matchesTitle || matchesDescription;
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container py-8 space-y-6">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-10" />
          </div>
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
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? <SortAsc /> : <SortDesc />}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts?.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
            >
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                {post.description && (
                  <p className="text-sm text-muted-foreground">
                    {post.description}
                  </p>
                )}
                {post.tags && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No gallery posts found
          </div>
        )}
      </div>
    </>
  );
}