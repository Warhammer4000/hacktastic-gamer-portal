import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AddNewsPost } from "./AddNewsPost";
import { NewsList } from "./NewsList";
import { SearchBar } from "./SearchBar";
import { BulkNewsUpload } from "./BulkNewsUpload";

type NewsPost = {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  status: 'draft' | 'published';
  created_at: string;
  published_at: string | null;
};

export function NewsTab() {
  const [showAddPost, setShowAddPost] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["news-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => post.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleEdit = (post: NewsPost) => {
    setEditingPost(post);
    setShowAddPost(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">News Posts</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowBulkUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button size="sm" onClick={() => {
            setEditingPost(null);
            setShowAddPost(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>
      </div>

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        availableTags={Array.from(new Set(posts?.flatMap(post => post.tags || []) || []))}
      />

      <NewsList 
        posts={filteredPosts || []} 
        isLoading={isLoading} 
        onEdit={handleEdit}
      />
      
      <AddNewsPost 
        open={showAddPost} 
        onOpenChange={setShowAddPost}
        editingPost={editingPost}
      />

      <BulkNewsUpload
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
      />
    </div>
  );
}