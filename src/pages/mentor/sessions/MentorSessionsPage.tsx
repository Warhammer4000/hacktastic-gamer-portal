import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SessionCard } from "./components/SessionCard";

export default function MentorSessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mentorTechStacks } = useQuery({
    queryKey: ['mentor-tech-stacks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('mentor_tech_stacks')
        .select('tech_stack_id')
        .eq('mentor_id', user.id);

      if (error) throw error;
      return data.map(stack => stack.tech_stack_id);
    },
  });

  const { data: sessions } = useQuery({
    queryKey: ['available-sessions', mentorTechStacks],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First get all sessions
      const { data: allSessions, error: sessionsError } = await supabase
        .from('session_templates')
        .select(`
          *,
          technology_stacks (*),
          session_availabilities (*)
        `)
        .eq('status', 'active')
        .or(`tech_stack_id.in.(${mentorTechStacks?.join(',')}),tech_stack_id.is.null`)
        .gte('end_date', new Date().toISOString());

      if (sessionsError) throw sessionsError;

      // Get mentor's bookings for these sessions
      const { data: bookings, error: bookingsError } = await supabase
        .from('session_bookings')
        .select('session_template_id, id')
        .eq('mentor_id', user.id)
        .eq('status', 'confirmed');

      if (bookingsError) throw bookingsError;

      // Filter out sessions where mentor has reached max slots
      const bookingCounts = bookings?.reduce((acc: Record<string, number>, booking) => {
        acc[booking.session_template_id] = (acc[booking.session_template_id] || 0) + 1;
        return acc;
      }, {});

      return allSessions.filter(session => 
        !bookingCounts[session.id] || bookingCounts[session.id] < session.max_slots_per_mentor
      );
    },
    enabled: !!mentorTechStacks,
  });

  const filteredSessions = sessions?.filter(session => 
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Available Sessions</h1>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions?.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}