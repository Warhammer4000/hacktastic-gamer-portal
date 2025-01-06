import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantProfileForm } from "@/components/participant/profile/ParticipantProfileForm";

export default function ParticipantProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['participant-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return profile;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <div className="bg-background rounded-xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />
        {profile && <ParticipantProfileForm profile={profile} />}
      </div>
    </div>
  );
}