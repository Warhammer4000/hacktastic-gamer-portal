import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

interface BulkInstitutionsUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkInstitutionsUpload({
  open,
  onOpenChange,
}: BulkInstitutionsUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadInstitutions = useMutation({
    mutationFn: async (institutions: any[]) => {
      const { error } = await supabase.from("institutions").insert(institutions);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      onOpenChange(false);
      setFile(null);
      toast.success("Institutions uploaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload institutions: " + error.message);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and format the data
        const institutions = jsonData.map((row: any) => ({
          name: row.name,
          type: row.type,
          logo_url: row.logo_url,
          location: row.location || null,
          email: row.email || null,
          phone: row.phone || null,
        }));

        uploadInstitutions.mutate(institutions);
      } catch (error) {
        toast.error("Error processing file: " + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Example University",
        type: "university",
        logo_url: "https://example.com/logo.png",
        location: "City, Country",
        email: "contact@example.com",
        phone: "+1234567890",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "institutions_template.xlsx");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Institutions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Download the template first and fill it with your data
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
          <Button
            onClick={handleUpload}
            disabled={!file}
            className="w-full"
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}