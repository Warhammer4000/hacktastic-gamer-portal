import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TeamMentorDetailsProps {
  mentorId: string | null;
}

export function TeamMentorDetails({ mentorId }: TeamMentorDetailsProps) {
  const { data: mentorProfile, isLoading } = useQuery({
    queryKey: ['mentor-profile', mentorId],
    queryFn: async () => {
      if (!mentorId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          full_name,
          avatar_url,
          github_username,
          linkedin_profile_id
        `)
        .eq('id', mentorId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!mentorId,
  });

  if (!mentorId) {
    return (
      <div className="rounded-lg border p-4 mt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-5 w-5" />
          <p>Pending Mentor Assignment</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border p-4 mt-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!mentorProfile) return null;

  return (
    <div className="rounded-lg border p-4 mt-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h3 className="font-semibold">Team Mentor</h3>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Name: {mentorProfile.full_name}</p>
          {mentorProfile.github_username && (
            <p>
              GitHub: <a 
                href={`https://github.com/${mentorProfile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {mentorProfile.github_username}
              </a>
            </p>
          )}
          {mentorProfile.linkedin_profile_id && (
            <p>
              LinkedIn: <a 
                href={`https://linkedin.com/in/${mentorProfile.linkedin_profile_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Profile
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}