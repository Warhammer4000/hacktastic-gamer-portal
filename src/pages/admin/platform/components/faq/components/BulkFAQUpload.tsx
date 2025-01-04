import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FAQStatus = "draft" | "published";

export function BulkFAQUpload({ open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    
    // Create example sheets
    const categories = [
      {
        name: "General FAQ",
        data: [
          ["Question", "Answer", "Status"],
          ["What is this?", "This is an example answer.", "draft"],
        ],
      },
      {
        name: "Technical FAQ",
        data: [
          ["Question", "Answer", "Status"],
          ["How to use?", "Here's how to use it...", "draft"],
        ],
      },
    ];

    categories.forEach(category => {
      const worksheet = XLSX.utils.aoa_to_sheet(category.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, category.name);
    });

    XLSX.writeFile(workbook, "faq_template.xlsx");
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Process each sheet as a category
          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            if (rows.length < 2) continue; // Skip empty sheets

            // Create the category
            const { data: category, error: categoryError } = await supabase
              .from("faq_categories")
              .insert({
                title: sheetName,
                status: "draft" as FAQStatus,
              })
              .select()
              .single();

            if (categoryError) throw categoryError;

            // Process FAQ items (skip header row)
            const faqItems = rows.slice(1).map(row => ({
              category_id: category.id,
              question: row[0],
              answer: row[1],
              status: (row[2]?.toLowerCase() === "published" ? "published" : "draft") as FAQStatus,
            })).filter(item => item.question && item.answer);

            if (faqItems.length > 0) {
              const { error: itemsError } = await supabase
                .from("faq_items")
                .insert(faqItems);

              if (itemsError) throw itemsError;
            }
          }

          toast({
            title: "Success",
            description: "FAQ data imported successfully",
          });

          queryClient.invalidateQueries({ queryKey: ["faq-categories"] });
          onOpenChange(false);
        } catch (error) {
          console.error("Import error:", error);
          toast({
            variant: "destructive",
            title: "Import failed",
            description: "Failed to import FAQ data. Please check the file format.",
          });
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("File reading error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read the file",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                status: "draft" as FAQStatus,
              })
              .select()
              .single();
            
            if (newCategory) {
              categoryId = newCategory.id;
            }
          }

          if (categoryId) {
            const status = (values[3]?.trim().toLowerCase() === "published" ? "published" : "draft") as FAQStatus;
            
            await supabase
              .from("faq_items")
              .insert({
                category_id: categoryId,
                question: values[1],
                answer: values[2],
                status: status,
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
          <DialogDescription>
            Upload FAQ items in bulk using either Excel or CSV format
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="excel">Excel</TabsTrigger>
            <TabsTrigger value="csv">CSV</TabsTrigger>
          </TabsList>

          <TabsContent value="excel" className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Excel Template
            </Button>

            <div className="grid w-full items-center gap-1.5">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                disabled={isLoading}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Upload an Excel file where each sheet represents a category.
              Each sheet should have columns: Question, Answer, Status.
            </div>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>

            <div className="grid w-full items-center gap-1.5">
              <Input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                disabled={isLoading}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Upload a CSV file with columns: category_title, question,
              answer, status. Status should be either "draft" or "published".
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}