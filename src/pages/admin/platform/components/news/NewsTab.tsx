import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AddNewsPost } from "./AddNewsPost";
import { NewsList } from "./NewsList";
import { SearchBar } from "./SearchBar";

export function NewsTab() {
  const [showAddPost, setShowAddPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">News Posts</h2>
        <Button size="sm" onClick={() => setShowAddPost(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        availableTags={Array.from(new Set(posts?.flatMap(post => post.tags || []) || []))}
      />

      <NewsList posts={filteredPosts || []} isLoading={isLoading} />
      
      <AddNewsPost open={showAddPost} onOpenChange={setShowAddPost} />
    </div>
  );
}