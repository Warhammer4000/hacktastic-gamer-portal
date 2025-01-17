import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BulkUploadJob, UploadResponse } from "../types/upload";

export function useBulkUpload() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: jobStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['bulk-upload-job', currentJobId],
    queryFn: async () => {
      if (!currentJobId) return null;
      
      const { data, error } = await supabase
        .from('bulk_upload_jobs')
        .select('*')
        .eq('id', currentJobId)
        .single();

      if (error) throw error;
      
      return data as BulkUploadJob;
    },
    enabled: !!currentJobId,
    refetchInterval: (data) => 
      data && data.status !== 'completed' && data.status !== 'failed' ? 1000 : false,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/functions/v1/bulk-mentor-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result as UploadResponse;
    },
    onSuccess: (data) => {
      setCurrentJobId(data.jobId);
      toast.success('Upload started successfully');
      queryClient.invalidateQueries({ queryKey: ['mentor-users'] });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to start upload');
    },
  });

  const resetUpload = () => {
    setCurrentJobId(null);
  };

  return {
    uploadMutation,
    jobStatus,
    isLoadingStatus,
    resetUpload,
    isUploading: uploadMutation.isPending,
  };
}