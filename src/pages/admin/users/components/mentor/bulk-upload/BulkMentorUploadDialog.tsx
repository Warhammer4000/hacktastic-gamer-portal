import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileUploadSection } from "./FileUploadSection";
import { DialogFooter } from "./DialogFooter";
import { UploadProgress } from "./components/UploadProgress";
import { StatusList } from "./components/StatusList";
import { UploadSummary } from "./components/UploadSummary";
import { useBulkUpload } from "./hooks/useBulkUpload";
import { useUploadStatus } from "./hooks/useUploadStatus";

interface BulkMentorUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkMentorUploadDialog({ open, onOpenChange }: BulkMentorUploadDialogProps) {
  const { statuses, progress, summary, initializeUpload, updateStatus, finishUpload, getFailedEntries } = useUploadStatus();
  const { uploadMentors, isUploading } = useBulkUpload({
    onUploadStart: (total) => initializeUpload(total),
    onEntryProgress: updateStatus,
    onUploadComplete: finishUpload,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        uploadMentors.mutate(csvData);
      };
      
      reader.readAsText(file);
    }
  };

  const handleExportFailed = () => {
    const failedEntries = getFailedEntries();
    // Create CSV content
    const csvContent = [
      "email,full_name,github_username,linkedin_profile_id,institution_name,bio,avatar_url,team_count,tech_stacks",
      ...failedEntries.map(entry => entry.email)
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'failed_mentors.csv';
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

        <div className="space-y-4">
          <FileUploadSection
            onFileChange={handleFileChange}
            isUploading={isUploading}
          />

          {progress.total > 0 && (
            <UploadProgress progress={progress} />
          )}

          {statuses.length > 0 && (
            <StatusList statuses={statuses} />
          )}

          {summary && (
            <UploadSummary 
              summary={summary}
              onExportFailed={handleExportFailed}
            />
          )}
        </div>

        <DialogFooter
          onClose={() => onOpenChange(false)}
          isUploading={isUploading}
        />
      </DialogContent>
    </Dialog>
  );
}