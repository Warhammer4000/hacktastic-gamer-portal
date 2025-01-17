import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useBulkUpload } from "./hooks/useBulkUpload";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BulkMentorUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkMentorUploadDialog({ 
  open, 
  onOpenChange 
}: BulkMentorUploadDialogProps) {
  const { 
    uploadMutation, 
    jobStatus, 
    isLoadingStatus, 
    resetUpload, 
    isUploading 
  } = useBulkUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleClose = () => {
    resetUpload();
    onOpenChange(false);
  };

  const getProgressPercentage = () => {
    if (!jobStatus?.total_records) return 0;
    return (jobStatus.processed_records / jobStatus.total_records) * 100;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Mentors</DialogTitle>
          <DialogDescription>
            Upload a CSV file with mentor information. Download the template for the correct format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading || !!jobStatus}
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

          {jobStatus && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Progress value={getProgressPercentage()} />
                <p className="text-sm text-muted-foreground">
                  Processing {jobStatus.processed_records} of {jobStatus.total_records} mentors
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2">Upload Status</h4>
                <div className="space-y-1">
                  <p className="text-sm">Total: {jobStatus.total_records}</p>
                  <p className="text-sm text-green-600">
                    Successful: {jobStatus.successful_records}
                  </p>
                  <p className="text-sm text-red-600">
                    Failed: {jobStatus.failed_records}
                  </p>
                </div>
              </div>

              {jobStatus.error_log.length > 0 && (
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-2">
                    {jobStatus.error_log.map((error, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{error.email}</p>
                          <p className="text-red-500">{error.error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {jobStatus.status === 'completed' && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Upload completed successfully</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
            {!jobStatus && (
              <Button
                type="submit"
                disabled={isUploading}
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}