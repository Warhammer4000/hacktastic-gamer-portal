import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { parseICSFile } from "../../utils/ics-parser";
import { useToast } from "@/hooks/use-toast";

interface ICSImportProps {
  onImport: (eventData: any) => void;
}

export function ICSImport({ onImport }: ICSImportProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const eventData = parseICSFile(text);
      onImport(eventData);
      
      toast({
        title: "Success",
        description: "Event data imported successfully",
      });
    } catch (error) {
      console.error("Error parsing ICS file:", error);
      toast({
        title: "Error",
        description: "Failed to import ICS file. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="h-4 w-4" />
        <span className="text-sm font-medium">Import from ICS</span>
      </div>
      <Button
        variant="outline"
        className="w-full relative"
        disabled={isLoading}
      >
        <input
          type="file"
          accept=".ics"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {isLoading ? "Importing..." : "Choose ICS file"}
      </Button>
    </div>
  );
}