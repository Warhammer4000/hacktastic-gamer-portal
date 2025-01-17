import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UploadStatus } from "../types/upload";
import { toast } from "sonner";

interface UseBulkUploadProps {
  onUploadStart: (total: number) => void;
  onEntryProgress: (status: UploadStatus) => void;
  onUploadComplete: () => void;
}

export function useBulkUpload({ onUploadStart, onEntryProgress, onUploadComplete }: UseBulkUploadProps) {
  const uploadMentors = useMutation({
    mutationFn: async (csvData: string) => {
      const rows = csvData.split('\n').slice(1); // Skip header row
      onUploadStart(rows.length);
      
      // Process in batches of 5
      const batchSize = 5;
      const results = [];
      
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const batchPromises = batch.map(async (row) => {
          const [
            email,
            fullName,
            githubUsername,
            linkedinProfileId,
            institutionName,
            bio,
            avatarUrl,
            teamCount,
            techStacks
          ] = row.split(',').map(field => field.trim());

          if (!email || !fullName) return;

          try {
            onEntryProgress({
              email,
              status: 'processing'
            });

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

            // Call the create_mentor function
            const { data, error } = await supabase
              .rpc('create_mentor', {
                mentor_email: email,
                mentor_full_name: fullName,
                mentor_github_username: githubUsername || null,
                mentor_linkedin_profile_id: linkedinProfileId || null,
                mentor_institution_id: institutionId,
                mentor_bio: bio || null,
                mentor_avatar_url: avatarUrl || null,
                mentor_team_count: teamCount ? parseInt(teamCount) : 2,
                mentor_tech_stacks: techStacks ? techStacks.split(';').map(s => s.trim()) : []
              });

            if (error) {
              onEntryProgress({
                email,
                status: 'failed',
                error: error.message
              });
              return;
            }

            const response = data as CreateMentorResponse;
            if (!response.success) {
              onEntryProgress({
                email,
                status: 'failed',
                error: response.error || 'Unknown error occurred'
              });
              return;
            }

            onEntryProgress({
              email,
              status: 'success',
              details: {
                mentorId: response.user_id,
                techStacksAdded: techStacks ? techStacks.split(';').length : 0,
                institutionFound: !!institutionId
              }
            });

          } catch (error) {
            onEntryProgress({
              email,
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        });

        // Process batch with delay between batches
        await Promise.all(batchPromises);
        if (i + batchSize < rows.length) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between batches
        }
      }

      onUploadComplete();
      return results;
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