import type { GalleryPostsTable } from "@/integrations/supabase/types/tables/gallery-posts";

export type GalleryPost = {
  id: string;
  title: string;
  image_url: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
};

export type GalleryListProps = {
  posts: GalleryPost[];
  isLoading: boolean;
};

export type GalleryActionButtonsProps = {
  post: GalleryPost;
  onEdit: (post: GalleryPost) => void;
  onDelete: (postId: string) => void;
  onStatusChange: (postId: string, newStatus: 'draft' | 'published') => void;
};

export type BulkActionsProps = {
  selectedPosts: string[];
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
};