import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BulkGalleryUpload({ open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = "title,image_url,description,tags\nExample Title,https://example.com/image.jpg,Example Description,\"tag1,tag2,tag3\"";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gallery_posts_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split("\n");
        const headers = rows[0].split(",");
        const posts = [];

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(",");
          const post = {
            title: values[0],
            image_url: values[1],
            description: values[2] || null,
            tags: values[3] ? values[3].replace(/"/g, "").split(",").map(tag => tag.trim()) : null,
          };
          posts.push(post);
        }

        const { error } = await supabase
          .from("gallery_posts")
          .insert(posts);

        if (error) throw error;

        toast({
          title: "Success",
          description: `${posts.length} gallery posts created successfully`,
        });

        queryClient.invalidateQueries({ queryKey: ["gallery-posts"] });
        onOpenChange(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload gallery posts",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Gallery Posts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={downloadTemplate}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>

          <div className="grid w-full items-center gap-1.5">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns: title, image_url,
            description, tags. Tags should be comma-separated and enclosed in
            quotes.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}