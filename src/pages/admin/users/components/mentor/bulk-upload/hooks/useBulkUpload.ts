import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from 'papaparse';
import { UploadStatus } from '../types/upload';

interface UseBulkUploadProps {
  onUploadStart: (total: number) => void;
  onEntryProgress: (status: UploadStatus) => void;
  onUploadComplete: () => void;
}

interface MentorData {
  email: string;
  full_name: string;
  github_username?: string;
  linkedin_profile_id?: string;
  institution_name?: string;
  bio?: string;
  avatar_url?: string;
  team_count?: string;
  tech_stacks?: string;
}

export function useBulkUpload({ onUploadStart, onEntryProgress, onUploadComplete }: UseBulkUploadProps) {
  const createUploadJob = async () => {
    const { data, error } = await supabase
      .from('bulk_upload_jobs')
      .insert([{ 
        status: 'pending',
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  };

  const uploadMentors = useMutation({
    mutationFn: async (csvData: string) => {
      return new Promise((resolve, reject) => {
        Papa.parse<MentorData>(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: async (parseResults) => {
            try {
              const rows = parseResults.data;
              onUploadStart(rows.length);

              // Create upload job
              const jobId = await createUploadJob();

              // Process mentors data
              const mentorsData = rows.map(row => ({
                ...row,
                tech_stacks: row.tech_stacks ? row.tech_stacks.split(';').map(s => s.trim()) : [],
                team_count: row.team_count ? parseInt(row.team_count) : 2
              }));

              // Call setup_mentor_data function
              const { data, error } = await supabase.functions.invoke('bulk-mentor-upload', {
                body: { 
                  mentors: mentorsData.map(mentor => ({
                    ...mentor,
                    user_id: mentor.email, // Use email as temporary user_id
                    team_count: mentor.team_count || 2,
                    tech_stacks: mentor.tech_stacks || []
                  })),
                  jobId 
                }
              });

              if (error) throw error;

              // Process results
              data.results.forEach((result: any) => {
                onEntryProgress({
                  email: result.email,
                  status: result.success ? 'success' : 'failed',
                  error: result.error,
                  details: result.details
                });
              });

              onUploadComplete();
              resolve(data);
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => {
            toast.error('Failed to parse CSV file');
            console.error('CSV Parse Error:', error);
            reject(error);
          }
        });
      });
    },
    onSuccess: () => {
      toast.success("Bulk upload completed");
    },
    onError: (error) => {
      toast.error('Failed to process bulk upload');
      console.error('Error:', error);
    },
  });

  return {
    uploadMentors,
    isUploading: uploadMentors.isPending
  };
}