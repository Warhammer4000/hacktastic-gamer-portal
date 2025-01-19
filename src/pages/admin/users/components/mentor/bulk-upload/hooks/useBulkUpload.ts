import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from 'papaparse';
import { UploadStatus, UploadProgress, UploadSummary } from '../types/upload';

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

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-12);
};

export function useBulkUpload({ onUploadStart, onEntryProgress, onUploadComplete }: UseBulkUploadProps) {
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
              
              // Process in batches of 5
              const batchSize = 5;
              const uploadResults = [];
              
              for (let i = 0; i < rows.length; i += batchSize) {
                const batch = rows.slice(i, i + batchSize);
                const batchPromises = batch.map(async (row) => {
                  const {
                    email,
                    full_name,
                    github_username,
                    linkedin_profile_id,
                    institution_name,
                    bio,
                    avatar_url,
                    team_count,
                    tech_stacks
                  } = row;

                  if (!email || !full_name) return;

                  try {
                    onEntryProgress({
                      email,
                      status: 'processing'
                    });

                    const password = generateRandomPassword();
                    
                    // Create user with admin API
                    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                      email,
                      password,
                      email_confirm: true,
                      user_metadata: {
                        full_name,
                        email_verified: true
                      }
                    });

                    if (authError || !authData.user) {
                      onEntryProgress({
                        email,
                        status: 'failed',
                        error: authError?.message || 'Failed to create user'
                      });
                      return;
                    }

                    // Find institution if provided
                    let institutionId = null;
                    if (institution_name) {
                      const { data: institutions } = await supabase
                        .from('institutions')
                        .select('id')
                        .eq('name', institution_name)
                        .single();
                      institutionId = institutions?.id;
                    }

                    // Setup mentor data
                    const { data: setupData, error: setupError } = await supabase
                      .rpc('setup_mentor_data', {
                        mentor_id: authData.user.id,
                        mentor_github_username: github_username || null,
                        mentor_linkedin_profile_id: linkedin_profile_id || null,
                        mentor_institution_id: institutionId,
                        mentor_bio: bio || null,
                        mentor_avatar_url: avatar_url || null,
                        mentor_team_count: team_count ? parseInt(team_count) : 2,
                        mentor_tech_stacks: tech_stacks ? tech_stacks.split(';').map(s => s.trim()) : []
                      });

                    if (setupError) {
                      onEntryProgress({
                        email,
                        status: 'failed',
                        error: setupError.message
                      });
                      return;
                    }

                    onEntryProgress({
                      email,
                      status: 'success',
                      details: {
                        mentorId: authData.user.id,
                        techStacksAdded: tech_stacks ? tech_stacks.split(';').length : 0,
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
              resolve(uploadResults);
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