import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AddNewsPostProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormValues = {
  title: string;
  content: string;
  tags: string[];
  publishDate: string;
};

export function AddNewsPost({ open, onOpenChange }: AddNewsPostProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] dark:prose-invert'
      }
    }
  });

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      publishDate: new Date().toISOString().split('T')[0]
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("news_posts").insert({
        title: values.title,
        content: editor?.getHTML() || '',
        tags: values.tags,
        status: "draft",
        published_at: values.publishDate ? new Date(values.publishDate).toISOString() : null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "News post created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["news-posts"] });
      onOpenChange(false);
      form.reset();
      editor?.commands.setContent('');
    } catch (error) {
      console.error("Error creating news post:", error);
      toast({
        title: "Error",
        description: "Failed to create news post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create News Post</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto">
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className={cn(
                      "min-h-[200px] rounded-md border",
                      isPreview ? "prose dark:prose-invert max-w-none p-4" : "p-0"
                    )}>
                      {isPreview ? (
                        <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
                      ) : (
                        <EditorContent editor={editor} className="min-h-[200px]" />
                      )}
                    </div>
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}