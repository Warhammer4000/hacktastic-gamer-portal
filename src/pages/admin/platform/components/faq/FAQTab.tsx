import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FAQCategoriesList } from "./components/FAQCategoriesList";
import { AddFAQCategory } from "./components/AddFAQCategory";
import { BulkFAQUpload } from "./components/BulkFAQUpload";

export function FAQTab() {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["faq-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_categories")
        .select("*, faq_items(*)")
        .order("sort_order");

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">FAQ Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBulkUpload(true)}
          >
            Bulk Upload
          </Button>
          <Button onClick={() => setShowAddCategory(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <FAQCategoriesList 
        categories={categories} 
        isLoading={isLoading} 
      />

      <AddFAQCategory
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
      />

      <BulkFAQUpload
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
      />
    </div>
  );
}