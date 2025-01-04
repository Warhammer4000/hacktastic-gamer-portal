import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash, CheckSquare, XSquare } from "lucide-react";
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

type GalleryPost = {
  id: string;
  title: string;
  image_url: string;
  description: string | null;
  tags: string[] | null;
  created_at: string;
  status: 'draft' | 'published';
};

type Props = {
  posts: GalleryPost[];
  isLoading: boolean;
};

export function GalleryList({ posts, isLoading }: Props) {
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
        .update({ status: 'published' })
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
        .update({ status: 'draft' })
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
      {selectedPosts.length > 0 && (
        <div className="flex gap-2 items-center bg-muted p-4 rounded-lg">
          <span className="text-sm font-medium">
            {selectedPosts.length} items selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkPublish}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Publish Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkUnpublish}
          >
            <XSquare className="h-4 w-4 mr-2" />
            Unpublish Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

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
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPost(post)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from('gallery_posts')
                        .delete()
                        .eq('id', post.id);

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
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('gallery_posts')
                      .update({ 
                        status: post.status === 'published' ? 'draft' : 'published' 
                      })
                      .eq('id', post.id);

                    if (error) throw error;

                    toast({
                      title: "Success",
                      description: `Post ${post.status === 'published' ? 'unpublished' : 'published'} successfully`,
                    });
                    queryClient.invalidateQueries({ queryKey: ["gallery-posts"] });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to update post status",
                    });
                  }
                }}
              >
                {post.status === 'published' ? (
                  <>
                    <XSquare className="h-4 w-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
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