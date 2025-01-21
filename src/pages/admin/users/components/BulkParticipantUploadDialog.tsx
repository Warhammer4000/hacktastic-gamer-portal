import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BulkParticipantUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkParticipantUploadDialog({
  open,
  onOpenChange,
}: BulkParticipantUploadDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Array<{ email: string; error: string }>>([]);
  const queryClient = useQueryClient();

  const downloadTemplate = () => {
    const csvContent = "email,full_name,github_username,institution_name,bio,avatar_url\nexample@email.com,John Doe,johndoe,Example University,A brief bio about the participant,https://example.com/avatar.jpg";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    setIsLoading(true);
    setProgress(0);
    setErrors([]);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        console.log("CSV content:", text);

        const rows = text.split("\n");
        console.log("Total rows found:", rows.length);
        
        const headers = rows[0].split(",");
        console.log("CSV headers:", headers);

        const participants = [];

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) {
            console.log(`Skipping empty row ${i}`);
            continue;
          }
          
          const values = rows[i].split(",");
          console.log(`Processing row ${i}:`, values);

          const participant = {
            email: values[0].trim(),
            full_name: values[1].trim(),
            github_username: values[2]?.trim() || null,
            institution_name: values[3]?.trim() || null,
            bio: values[4]?.trim() || null,
            avatar_url: values[5]?.trim() || null,
          };
          console.log(`Parsed participant data for row ${i}:`, participant);
          participants.push(participant);
        }

        console.log("Final participants array:", participants);

        // Create a bulk upload job
        const { data: jobData, error: jobError } = await supabase
          .from('bulk_upload_jobs')
          .insert({
            total_records: participants.length,
            file_name: file.name,
            file_size: file.size,
            upload_type: 'participant'
          })
          .select()
          .single();

        if (jobError) {
          console.error("Error creating bulk upload job:", jobError);
          throw jobError;
        }

        console.log("Bulk upload job created:", jobData);

        // Call the edge function
        const { data, error } = await supabase.functions.invoke('bulk-participant-upload', {
          body: { participants, jobId: jobData.id }
        });

        if (error) {
          console.error("Edge function error:", error);
          throw error;
        }

        console.log("Edge function response:", data);

        if (data.results) {
          const failedEntries = data.results.filter((result: any) => !result.success);
          setErrors(failedEntries);
          
          if (failedEntries.length > 0) {
            toast.error(`Failed to create ${failedEntries.length} participants`);
          }
        }

        // Start polling for job status
        const pollInterval = setInterval(async () => {
          const { data: job } = await supabase
            .from('bulk_upload_jobs')
            .select('*')
            .eq('id', jobData.id)
            .single();

          if (job) {
            console.log("Job status update:", {
              status: job.status,
              processed: job.processed_records,
              total: job.total_records,
              successful: job.successful_records,
              failed: job.failed_records
            });

            const progress = (job.processed_records / job.total_records) * 100;
            setProgress(progress);

            if (job.status === 'completed' || job.status === 'failed') {
              clearInterval(pollInterval);
              setIsLoading(false);
              
              if (job.status === 'completed') {
                toast.success(`Successfully created ${job.successful_records} participants`);
                if (job.failed_records > 0) {
                  console.error("Failed records:", job.error_log);
                }
              } else {
                toast.error('Bulk upload failed');
                console.error("Job failed:", job.error_log);
              }
              
              queryClient.invalidateQueries({ queryKey: ["participants"] });
              onOpenChange(false);
            }
          }
        }, 1000);

      } catch (error) {
        console.error("Error uploading participants:", error);
        toast.error("Failed to upload participants");
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Participants</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={downloadTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>

          <div className="grid w-full items-center gap-1.5">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Processing... {Math.round(progress)}%
              </p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="space-y-2">
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to create the following participants:
                </AlertDescription>
              </Alert>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{error.email}:</span> {error.error}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns: email, full_name, 
            github_username, institution_name, bio, avatar_url. Only email and 
            full_name are required fields.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}