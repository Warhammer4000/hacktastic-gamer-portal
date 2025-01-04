import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import { NewsEditor } from "./editor/NewsEditor";
import { NewsPreview } from "./preview/NewsPreview";

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

type FormValues = {
  title: string;
  content: string;
  tags: string[];
  publishDate: string;
};

export function AddNewsPost({ open, onOpenChange, editingPost }: AddNewsPostProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      publishDate: new Date().toISOString().split('T')[0]
    },
  });

  useEffect(() => {
    if (editingPost) {
      form.reset({
        title: editingPost.title,
        content: editingPost.content,
        tags: editingPost.tags || [],
        publishDate: editingPost.publishDate || new Date().toISOString().split('T')[0]
      });
    } else {
      form.reset({
        title: "",
        content: "",
        tags: [],
        publishDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingPost, form]);

  const onSubmit = async (values: FormValues) => {
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
      form.reset();
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
          <div className="flex items-center justify-between">
            <DialogTitle>{editingPost ? "Edit News Post" : "Create News Post"}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter news title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publish Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <MultiSelect
                          placeholder="Select or create tags"
                          selected={field.value}
                          options={[]}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 gap-4">
                          <NewsEditor content={field.value} onChange={field.onChange} />
                          {isPreview && (
                            <NewsPreview content={field.value} />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (editingPost ? "Updating..." : "Creating...") : (editingPost ? "Update Post" : "Create Post")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}