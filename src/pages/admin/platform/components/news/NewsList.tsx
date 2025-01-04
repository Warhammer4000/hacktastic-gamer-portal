import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NewsCard } from "./components/NewsCard";
import { DeleteNewsDialog } from "./components/DeleteNewsDialog";
import { PreviewNewsDialog } from "./components/PreviewNewsDialog";
import { SortButton } from "./components/SortButton";

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
  onEdit: (post: NewsPost) => void;
};

export function NewsList({ posts, isLoading, onEdit }: Props) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("news_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "News post deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["news-posts"] });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting news post:", error);
      toast({
        title: "Error",
        description: "Failed to delete news post",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  if (sortedPosts.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No news posts found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SortButton 
          direction={sortDirection}
          onToggle={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
        />
      </div>

      <div className="grid gap-4">
        {sortedPosts.map((post) => (
          <NewsCard
            key={post.id}
            post={post}
            onEdit={onEdit}
            onDelete={(post) => {
              setSelectedPost(post);
              setDeleteDialogOpen(true);
            }}
            onPreview={(post) => {
              setSelectedPost(post);
              setPreviewDialogOpen(true);
            }}
          />
        ))}
      </div>

      <DeleteNewsDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => selectedPost && handleDelete(selectedPost.id)}
      />

      <PreviewNewsDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        title={selectedPost?.title || ""}
        content={selectedPost?.content || ""}
      />
    </div>
  );
}