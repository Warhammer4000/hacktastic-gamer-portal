import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadResult {
  email: string;
  success: boolean;
  error?: string;
}

export function useBulkUpload(onSuccess: () => void) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadMentors = useMutation({
    mutationFn: async (csvData: string) => {
      const rows = csvData.split('\n').slice(1); // Skip header row
      const results: UploadResult[] = [];

      for (const row of rows) {
        const [email, fullName, githubUsername, linkedinProfileId, institutionName, teamCount] = row.split(',').map(field => field.trim());
        if (!email || !fullName) continue;

        const password = Math.random().toString(36).slice(-8); // Generate random password

        try {
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
            results.push({ 
              email, 
              success: false, 
              error: authError?.message || "Failed to create user" 
            });
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
        } catch (error) {
          results.push({ 
            email, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
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
      
      onSuccess();
      setFile(null);
    },
    onError: (error) => {
      toast.error('Failed to process bulk upload');
      console.error('Error:', error);
    },
  });

  return {
    file,
    setFile,
    uploadMentors
  };
}