import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useBulkUpload() {
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

      return response.json();
    },
    onSuccess: () => {
      toast.success('Upload started successfully. You will be notified when it completes.');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to start upload');
    },
  });

  return {
    uploadMutation,
    isUploading: uploadMutation.isPending
  };
}