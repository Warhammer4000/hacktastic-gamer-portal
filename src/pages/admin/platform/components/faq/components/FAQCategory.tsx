import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Edit, Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { FAQItemsList } from "./FAQItemsList";
import { AddFAQItem } from "./AddFAQItem";

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
  category: Category;
  onOrderChange: (newOrder: number) => void;
};

export function FAQCategory({ category, onOrderChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("faq_categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async () => {
      const newStatus = category.status === "published" ? "draft" : "published";
      const { error } = await supabase
        .from("faq_categories")
        .update({ status: newStatus })
        .eq("id", category.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq-categories"] });
      toast({
        title: "Success",
        description: "Category status updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category status",
      });
    },
  });

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <h3 className="text-lg font-medium">{category.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={category.status === "published"}
            onCheckedChange={() => toggleStatus.mutate()}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddItem(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <FAQItemsList
          categoryId={category.id}
          items={category.faq_items}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category and all its FAQ items.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategory.mutate()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddFAQItem
        open={showAddItem}
        onOpenChange={setShowAddItem}
        categoryId={category.id}
      />
    </div>
  );
}