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

            const password = Math.random().toString(36).slice(-8);

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

            if (authError || !authData.user) {
              onEntryProgress({
                email,
                status: 'failed',
                error: authError?.message || "Failed to create user"
              });
              return;
            }

            // Add mentor role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert([{
                user_id: authData.user.id,
                role: 'mentor'
              }]);

            if (roleError) {
              onEntryProgress({
                email,
                status: 'failed',
                error: roleError.message
              });
              return;
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

            // Update profile
            const { error: profileError } = await supabase
              .from('profiles')
              .update({
                github_username: githubUsername,
                linkedin_profile_id: linkedinProfileId,
                institution_id: institutionId,
                bio: bio || null,
                avatar_url: avatarUrl || null,
                status: 'pending_approval'
              })
              .eq('id', authData.user.id);

            if (profileError) {
              onEntryProgress({
                email,
                status: 'failed',
                error: profileError.message
              });
              return;
            }

            // Set mentor preferences
            if (teamCount) {
              const { error: prefError } = await supabase
                .from('mentor_preferences')
                .insert({
                  mentor_id: authData.user.id,
                  team_count: parseInt(teamCount)
                });

              if (prefError) {
                onEntryProgress({
                  email,
                  status: 'failed',
                  error: prefError.message
                });
                return;
              }
            }

            // Add tech stacks
            let techStacksAdded = 0;
            if (techStacks) {
              const techStackNames = techStacks.split(';').map(s => s.trim());
              const { data: existingStacks } = await supabase
                .from('technology_stacks')
                .select('id, name')
                .in('name', techStackNames);

              if (existingStacks) {
                const techStackInserts = existingStacks.map(stack => ({
                  mentor_id: authData.user.id,
                  tech_stack_id: stack.id
                }));

                const { error: techStackError } = await supabase
                  .from('mentor_tech_stacks')
                  .insert(techStackInserts);

                if (techStackError) {
                  onEntryProgress({
                    email,
                    status: 'failed',
                    error: techStackError.message
                  });
                  return;
                }
                techStacksAdded = techStackInserts.length;
              }
            }

            onEntryProgress({
              email,
              status: 'success',
              details: {
                mentorId: authData.user.id,
                techStacksAdded,
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

        await Promise.all(batchPromises);
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