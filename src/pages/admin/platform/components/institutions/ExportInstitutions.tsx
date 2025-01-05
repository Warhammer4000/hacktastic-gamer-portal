import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export function ExportInstitutions() {
  const [isExporting, setIsExporting] = useState(false);

  const { data: institutions } = useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutions")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Transform data to match bulk upload format
      const exportData = institutions?.map((institution) => ({
        type: institution.type,
        name: institution.name,
        logo_url: institution.logo_url,
        location: institution.location || "",
        email: institution.email || "",
        phone: institution.phone || "",
        website_url: institution.website_url || "",
      })) || [];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Institutions");

      // Generate and download file
      XLSX.writeFile(wb, "institutions.xlsx");
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exporting..." : "Export"}
    </Button>
  );
}