import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Download } from "lucide-react";

interface BulkMentorUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BulkMentorUploadDialog({ open, onOpenChange }: BulkMentorUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadMentors = useMutation({
    mutationFn: async (csvData: string) => {
      const rows = csvData.split('\n').slice(1); // Skip header row
      const results = [];

      for (const row of rows) {
        const [email, fullName, githubUsername, linkedinProfileId, institutionName, teamCount] = row.split(',').map(field => field.trim());
        if (!email || !fullName) continue;

        const password = Math.random().toString(36).slice(-8); // Generate random password

        // Create user in auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (authError) {
          results.push({ email, success: false, error: authError.message });
          continue;
        }

        if (!authData.user) {
          results.push({ email, success: false, error: "Failed to create user" });
          continue;
        }

        // Add mentor role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: 'mentor'
          }]);

        if (roleError) {
          results.push({ email, success: false, error: roleError.message });
          continue;
        }

        // Find institution if provided
        let institutionId = null;
        if (institutionName) {
          const { data: institutions } = await supabase
            .from('institutions')
            .select('id')
            .eq('name', institutionName)
            .single();
          
          institutionId = institutions?.id;
        }

        // Update profile with additional information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            github_username: githubUsername,
            linkedin_profile_id: linkedinProfileId,
            institution_id: institutionId
          })
          .eq('id', authData.user.id);

        if (profileError) {
          results.push({ email, success: false, error: profileError.message });
          continue;
        }

        // Set mentor preferences if team count is provided
        if (teamCount) {
          const { error: prefError } = await supabase
            .from('mentor_preferences')
            .insert({
              mentor_id: authData.user.id,
              team_count: parseInt(teamCount)
            });

          if (prefError) {
            results.push({ email, success: false, error: prefError.message });
            continue;
          }
        }

        results.push({ email, success: true });
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      if (successful > 0) {
        toast.success(`Successfully added ${successful} mentor(s)`);
      }
      if (failed > 0) {
        toast.error(`Failed to add ${failed} mentor(s)`);
      }
      
      onOpenChange(false);
      setFile(null);
    },
    onError: (error) => {
      toast.error('Failed to process bulk upload');
      console.error('Error:', error);
    },
  });

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
          <div className="space-y-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with columns: email, full_name, github_username, linkedin_profile_id, institution_name, team_count
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>

            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || uploadMentors.isPending}
              >
                {uploadMentors.isPending ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}