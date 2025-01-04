import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BulkFAQUpload({ open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = "category_title,question,answer,status\nExample Category,What is this?,This is an example answer.,draft";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faq_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split("\n");
        const headers = rows[0].split(",");

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(",");
          const categoryTitle = values[0];
          
          // First, create or get the category
          const { data: existingCategories } = await supabase
            .from("faq_categories")
            .select("id")
            .eq("title", categoryTitle)
            .limit(1);

          let categoryId;
          
          if (existingCategories && existingCategories.length > 0) {
            categoryId = existingCategories[0].id;
          } else {
            const { data: newCategory } = await supabase
              .from("faq_categories")
              .insert({
                title: categoryTitle,
                status: "draft",
              })
              .select()
              .single();
            
            if (newCategory) {
              categoryId = newCategory.id;
            }
          }

          if (categoryId) {
            // Then create the FAQ item
            await supabase
              .from("faq_items")
              .insert({
                category_id: categoryId,
                question: values[1],
                answer: values[2],
                status: values[3] || "draft",
              });
          }
        }

        toast({
          title: "Success",
          description: "FAQ items uploaded successfully",
        });

        queryClient.invalidateQueries({ queryKey: ["faq-categories"] });
        onOpenChange(false);
      } catch (error) {
        console.error("Error uploading FAQ items:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload FAQ items",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload FAQ Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={downloadTemplate}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>

          <div className="grid w-full items-center gap-1.5">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns: category_title,
            question, answer, status. Status should be either "draft" or
            "published".
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}