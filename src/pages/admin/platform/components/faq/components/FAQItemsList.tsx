import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  status: 'draft' | 'published';
};

type Props = {
  categoryId: string;
  items: FAQItem[];
};

export function FAQItemsList({ categoryId, items }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleItemStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'draft' | 'published' }) => {
      const { error } = await supabase
        .from("faq_items")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categories"] });
      toast({
        title: "Success",
        description: "FAQ item status updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update FAQ item status",
      });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("faq_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categories"] });
      toast({
        title: "Success",
        description: "FAQ item deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete FAQ item",
      });
    },
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No FAQ items in this category yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded p-4 space-y-2"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-medium">{item.question}</h4>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={item.status === "published"}
                onCheckedChange={(checked) =>
                  toggleItemStatus.mutate({
                    id: item.id,
                    status: checked ? "published" : "draft",
                  })
                }
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteItem.mutate(item.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}