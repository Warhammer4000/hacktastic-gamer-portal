import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SessionList } from "./components/SessionList";
import { CreateSessionForm } from "./components/CreateSessionForm";

export default function SessionsPage() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['session-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_templates')
        .select(`
          *,
          technology_stacks (
            id,
            name,
            icon_url
          ),
          session_availabilities (
            id,
            day_of_week,
            start_time,
            end_time
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <CreateSessionForm />
      <SessionList sessions={sessions || []} />
    </div>
  );
}