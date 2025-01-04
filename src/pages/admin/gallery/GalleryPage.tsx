import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddGalleryPost } from "../platform/components/gallery/AddGalleryPost";
import { BulkGalleryUpload } from "../platform/components/gallery/BulkGalleryUpload";
import { GalleryList } from "../platform/components/gallery/GalleryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchGalleryPosts = async () => {
  const { data, error } = await supabase
    .from("gallery_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

const GalleryPage = () => {
  const [addPostOpen, setAddPostOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["gallery-posts"],
    queryFn: fetchGalleryPosts,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gallery Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <AddGalleryPost 
              open={addPostOpen} 
              onOpenChange={setAddPostOpen} 
            />
            <BulkGalleryUpload 
              open={bulkUploadOpen} 
              onOpenChange={setBulkUploadOpen} 
            />
          </div>
          <GalleryList posts={posts || []} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryPage;