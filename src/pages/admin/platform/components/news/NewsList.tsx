import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NewsPreview } from "./preview/NewsPreview";

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          Sort by Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-4">
        {sortedPosts.map((post) => (
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
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setSelectedPost(post);
                      setPreviewDialogOpen(true);
                    }}
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
                    onClick={() => {
                      setSelectedPost(post);
                      setDeleteDialogOpen(true);
                    }}
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
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the news post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedPost && handleDelete(selectedPost.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <div className="prose dark:prose-invert max-w-none">
            {selectedPost && (
              <>
                <h1>{selectedPost.title}</h1>
                <NewsPreview content={selectedPost.content} />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}