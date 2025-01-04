import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { EditGalleryPost } from "./EditGalleryPost";
import { BulkActions } from "./components/BulkActions";
import { GalleryActions } from "./components/GalleryActions";
import type { GalleryPost, GalleryListProps } from "./types";

export function GalleryList({ posts, isLoading }: GalleryListProps) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<GalleryPost | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSelect = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === posts.length
        ? []
        : posts.map(post => post.id)
    );
  };

  const handleBulkPublish = async () => {
    try {
      const { error } = await supabase
        .from('gallery_posts')
        .update({ status: 'published' as const })
        .in('id', selectedPosts);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Selected posts have been published",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-posts"] });
      setSelectedPosts([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish selected posts",
      });
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      const { error } = await supabase
        .from('gallery_posts')
        .update({ status: 'draft' as const })
        .in('id', selectedPosts);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Selected posts have been unpublished",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-posts"] });
      setSelectedPosts([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unpublish selected posts",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('gallery_posts')
        .delete()
        .in('id', selectedPosts);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Selected posts have been deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-posts"] });
      setSelectedPosts([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete selected posts",
      });
    }
  };

  const handleStatusChange = async (postId: string, newStatus: 'draft' | 'published') => {
    try {
      const { error } = await supabase
        .from('gallery_posts')
        .update({ status: newStatus })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-posts"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post status",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('gallery_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-posts"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No gallery posts found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BulkActions
        selectedPosts={selectedPosts}
        onPublish={handleBulkPublish}
        onUnpublish={handleBulkUnpublish}
        onDelete={handleBulkDelete}
      />

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          checked={selectedPosts.length === posts.length}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm">Select All</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="relative">
              <div className="absolute top-4 left-4">
                <Checkbox
                  checked={selectedPosts.includes(post.id)}
                  onCheckedChange={() => handleSelect(post.id)}
                />
              </div>
              <CardTitle>{post.title}</CardTitle>
              {post.description && (
                <CardDescription>{post.description}</CardDescription>
              )}
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
                onEdit={setEditingPost}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      {editingPost && (
        <EditGalleryPost
          post={editingPost}
          open={!!editingPost}
          onOpenChange={(open) => {
            if (!open) setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}