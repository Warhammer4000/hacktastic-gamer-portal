import { useQuery } from "@tanstack/react-query";
import { Loader2, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TeamCountPreference } from "./TeamCountPreference";
import { TechnologyStackPreference } from "./TechnologyStackPreference";
import { supabase } from "@/integrations/supabase/client";

export function MentorPreferences() {
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['mentor-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('mentor_preferences')
        .select('*')
        .eq('mentor_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data || { team_count: 1 }; // Default preferences if none exist
    },
  });

  if (preferencesLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Preferences</h2>
      </div>

      <Alert>
        <AlertDescription>
          Configure your mentoring preferences to help us match you with the right mentees.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <TeamCountPreference defaultValue={preferences?.team_count || 1} />
        <TechnologyStackPreference />
      </div>
    </div>
  );
}