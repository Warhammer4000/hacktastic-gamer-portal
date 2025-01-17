import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { useBulkUpload } from "./hooks/useBulkUpload";

interface BulkMentorUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkMentorUploadDialog({ 
  open, 
  onOpenChange 
}: BulkMentorUploadDialogProps) {
  const { file, setFile, uploadMutation, isUploading } = useBulkUpload(() => onOpenChange(false));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const downloadTemplate = () => {
    const csvContent = "email,full_name,github_username,linkedin_profile_id,institution_name,bio,avatar_url,team_count,tech_stacks\nexample@email.com,John Doe,johndoe,john-doe-123,Example University,A brief bio,https://example.com/avatar.jpg,2,react;typescript;node";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mentor_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Mentors</DialogTitle>
          <DialogDescription>
            Upload a CSV file with mentor information. Download the template for the correct format.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with columns: email, full_name, github_username, linkedin_profile_id, 
              institution_name, bio, avatar_url, team_count, tech_stacks
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={downloadTemplate}
            disabled={isUploading}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || isUploading}
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}