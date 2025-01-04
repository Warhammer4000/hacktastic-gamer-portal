import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddNewsPost } from "./AddNewsPost";
import { NewsList } from "./NewsList";
import { NewsHeader } from "./components/NewsHeader";
import { NewsFilters } from "./components/NewsFilters";
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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["news-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => post.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const availableTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const handleEdit = (post: NewsPost) => {
    setEditingPost(post);
    setShowAddPost(true);
  };

  return (
    <div className="space-y-4">
      <NewsHeader
        onAddPost={() => {
          setEditingPost(null);
          setShowAddPost(true);
        }}
        onBulkUpload={() => setShowBulkUpload(true)}
      />

      <NewsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        availableTags={availableTags}
      />

      <NewsList 
        posts={filteredPosts} 
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