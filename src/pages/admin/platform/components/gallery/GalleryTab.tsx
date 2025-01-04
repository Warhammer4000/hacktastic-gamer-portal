import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AddGalleryPost } from "./AddGalleryPost";
import { GalleryList } from "./GalleryList";
import { BulkGalleryUpload } from "./BulkGalleryUpload";

export function GalleryTab() {
  const [showAddPost, setShowAddPost] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["gallery-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gallery Posts</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkUpload(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button size="sm" onClick={() => setShowAddPost(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>
      </div>

      <GalleryList posts={posts || []} isLoading={isLoading} />
      
      <AddGalleryPost open={showAddPost} onOpenChange={setShowAddPost} />
      <BulkGalleryUpload open={showBulkUpload} onOpenChange={setShowBulkUpload} />
    </div>
  );
}