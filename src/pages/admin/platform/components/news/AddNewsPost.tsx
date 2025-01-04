import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { NewsForm } from "./components/NewsForm";

type AddNewsPostProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost?: {
    id: string;
    title: string;
    content: string;
    tags: string[] | null;
    publishDate?: string;
  } | null;
};

export function AddNewsPost({ open, onOpenChange, editingPost }: AddNewsPostProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const defaultValues = {
    title: editingPost?.title || "",
    content: editingPost?.content || "",
    tags: editingPost?.tags || [],
    publishDate: editingPost?.publishDate || new Date().toISOString().split('T')[0]
  };

  const handleSubmit = async (values: typeof defaultValues) => {
    try {
      setIsSubmitting(true);

      if (editingPost) {
        const { error } = await supabase
          .from("news_posts")
          .update({
            title: values.title,
            content: values.content,
            tags: values.tags,
            published_at: values.publishDate ? new Date(values.publishDate).toISOString() : null,
          })
          .eq("id", editingPost.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "News post updated successfully",
        });
      } else {
        const { error } = await supabase.from("news_posts").insert({
          title: values.title,
          content: values.content,
          tags: values.tags,
          status: "draft",
          published_at: values.publishDate ? new Date(values.publishDate).toISOString() : null,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "News post created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["news-posts"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving news post:", error);
      toast({
        title: "Error",
        description: "Failed to save news post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editingPost ? "Edit News Post" : "Create News Post"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <NewsForm
            defaultValues={defaultValues}
            isSubmitting={isSubmitting}
            isPreview={isPreview}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            onTogglePreview={() => setIsPreview(!isPreview)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}