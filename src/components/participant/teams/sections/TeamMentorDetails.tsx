import { User, Github, Linkedin } from "lucide-react";
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
      <div className="flex items-center gap-2 text-muted-foreground">
        <User className="h-5 w-5" />
        <p>Pending Mentor Assignment</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (!mentorProfile) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {mentorProfile.avatar_url ? (
          <img 
            src={mentorProfile.avatar_url} 
            alt={mentorProfile.full_name || 'Mentor'} 
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        )}
        <div>
          <h5 className="font-medium">{mentorProfile.full_name}</h5>
          <div className="flex items-center gap-4 mt-2">
            {mentorProfile.github_username && (
              <a 
                href={`https://github.com/${mentorProfile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm">{mentorProfile.github_username}</span>
              </a>
            )}
            {mentorProfile.linkedin_profile_id && (
              <a 
                href={`https://linkedin.com/in/${mentorProfile.linkedin_profile_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <Linkedin className="h-4 w-4" />
                <span className="text-sm">{mentorProfile.linkedin_profile_id}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}