import { useState } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type FAQCategory = {
  id: string;
  title: string;
  faq_items: {
    question: string;
    answer: string;
    status: "draft" | "published";
  }[];
};

export function ExportFAQButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: categories } = useQuery({
    queryKey: ["faq-categories-export"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_categories")
        .select(`
          id,
          title,
          faq_items (
            question,
            answer,
            status
          )
        `)
        .order("sort_order");

      if (error) throw error;
      return data as FAQCategory[];
    },
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);

      if (!categories?.length) {
        toast({
          variant: "destructive",
          title: "No FAQ data",
          description: "There are no FAQ categories to export.",
        });
        return;
      }

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Create a worksheet for each category
      categories.forEach((category) => {
        const sheetData = [
          ["Question", "Answer", "Status"], // Headers
          ...category.faq_items.map((item) => [
            item.question,
            item.answer,
            item.status,
          ]),
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          // Ensure sheet name is valid and unique (max 31 chars)
          category.title.slice(0, 31).replace(/[\[\]\*\/\\\?]/g, "")
        );
      });

      // Generate Excel file
      XLSX.writeFile(workbook, "faq_export.xlsx");

      toast({
        title: "Export successful",
        description: "FAQ data has been exported to Excel.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export FAQ data. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className="h-4 w-4 mr-2" />
      Export to Excel
    </Button>
  );
}