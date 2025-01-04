import { AddGalleryPost } from "../platform/components/gallery/AddGalleryPost";
import { BulkGalleryUpload } from "../platform/components/gallery/BulkGalleryUpload";
import { GalleryList } from "../platform/components/gallery/GalleryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GalleryPage = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gallery Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <AddGalleryPost />
            <BulkGalleryUpload />
          </div>
          <GalleryList />
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryPage;