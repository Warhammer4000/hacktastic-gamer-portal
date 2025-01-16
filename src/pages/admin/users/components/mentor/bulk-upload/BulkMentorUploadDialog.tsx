import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileUploadSection } from "./FileUploadSection";
import { DialogFooter } from "./DialogFooter";
import { useBulkUpload } from "./useBulkUpload";

interface BulkMentorUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkMentorUploadDialog({ open, onOpenChange }: BulkMentorUploadDialogProps) {
  const { file, setFile, uploadMentors } = useBulkUpload(() => onOpenChange(false));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      uploadMentors.mutate(csvData);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = "email,full_name,github_username,linkedin_profile_id,institution_name,team_count\nexample@email.com,John Doe,johndoe,john-doe-123,Example University,2";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Mentors</DialogTitle>
          <DialogDescription>
            Upload a CSV file with mentor information. Download the template for the correct format.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUploadSection
            file={file}
            onFileChange={handleFileChange}
            downloadTemplate={downloadTemplate}
          />

          <DialogFooter
            onClose={() => onOpenChange(false)}
            isUploading={uploadMentors.isPending}
            file={file}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}