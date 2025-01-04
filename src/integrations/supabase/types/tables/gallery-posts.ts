export interface GalleryPostsTable {
  Row: {
    id: string;
    title: string;
    image_url: string;
    description: string | null;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'published';
  };
  Insert: {
    id?: string;
    title: string;
    image_url: string;
    description?: string | null;
    tags?: string[] | null;
    created_at?: string;
    updated_at?: string;
    status?: 'draft' | 'published';
  };
  Update: {
    id?: string;
    title?: string;
    image_url?: string;
    description?: string | null;
    tags?: string[] | null;
    created_at?: string;
    updated_at?: string;
    status?: 'draft' | 'published';
  };
}