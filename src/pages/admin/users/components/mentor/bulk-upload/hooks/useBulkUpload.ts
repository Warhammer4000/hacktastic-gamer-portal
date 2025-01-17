import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBulkUpload(onSuccess: () => void) {
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const reader = new FileReader();
      const csvData = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });

      // Skip header row and parse CSV
      const rows = csvData.split('\n').slice(1);
      const mentors = rows.map(row => {
        const [
          email,
          full_name,
          github_username,
          linkedin_profile_id,
          institution_name,
          bio,
          avatar_url,
          team_count,
          tech_stacks
        ] = row.split(',').map(field => field.trim());

        return {
          email,
          full_name,
          github_username,
          linkedin_profile_id,
          institution_name,
          bio,
          avatar_url,
          team_count: team_count ? parseInt(team_count) : 2,
          tech_stacks: tech_stacks ? tech_stacks.split(';') : []
        };
      }).filter(mentor => mentor.email && mentor.full_name);

      const { data, error } = await supabase.functions.invoke('bulk-mentor-upload', {
        body: { mentors }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      onSuccess();
      setFile(null);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to process bulk upload');
    },
  });

  return {
    file,
    setFile,
    uploadMutation,
    isUploading: uploadMutation.isPending
  };
}