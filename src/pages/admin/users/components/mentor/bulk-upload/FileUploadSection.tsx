import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadSectionProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  downloadTemplate: () => void;
}

export function FileUploadSection({ file, onFileChange, isUploading, downloadTemplate }: FileUploadSectionProps) {
  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        required
        disabled={isUploading}
      />
      <p className="text-sm text-muted-foreground">
        Upload a CSV file with columns: email, full_name, github_username, linkedin_profile_id, institution_name, bio, avatar_url, team_count, tech_stacks
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={downloadTemplate}
        disabled={isUploading}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Template
      </Button>
    </div>
  );
}