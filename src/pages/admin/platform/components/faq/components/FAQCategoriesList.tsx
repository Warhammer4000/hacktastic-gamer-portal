import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FAQCategory } from "./FAQCategory";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  status: 'draft' | 'published';
};

type Category = {
  id: string;
  title: string;
  sort_order: number;
  status: 'draft' | 'published';
  faq_items: FAQItem[];
};

type Props = {
  categories: Category[];
  isLoading: boolean;
};

export function FAQCategoriesList({ categories, isLoading }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateCategoryOrder = useMutation({
    mutationFn: async ({ id, sort_order }: { id: string; sort_order: number }) => {
      const { error } = await supabase
        .from("faq_categories")
        .update({ sort_order })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categories"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category order",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No FAQ categories found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <FAQCategory
          key={category.id}
          category={category}
          onOrderChange={(newOrder) =>
            updateCategoryOrder.mutate({
              id: category.id,
              sort_order: newOrder,
            })
          }
        />
      ))}
    </div>
  );
}