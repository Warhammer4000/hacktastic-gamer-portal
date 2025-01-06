import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MessageForm } from "@/components/mentor/messages/MessageForm";
import { MessageList } from "@/components/mentor/messages/MessageList";

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);

  // Fetch mentor's teams
  const { data: teams } = useQuery({
    queryKey: ['mentor-teams'],
    queryFn: async () => {
      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          team_members (
            user_id,
            profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('mentor_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'active');

      if (error) throw error;
      return teams;
    },
  });

  // Fetch messages for all teams
  const { data: teamMessages } = useQuery({
    queryKey: ['team-messages'],
    queryFn: async () => {
      if (!teams?.length) return [];

      const teamIds = teams.map(team => team.id);
      const { data, error } = await supabase
        .from('team_messages')
        .select(`
          *,
          sender:profiles!team_messages_sender_id_fkey (
            full_name,
            avatar_url
          ),
          team:teams!team_messages_team_id_fkey (
            name
          )
        `)
        .in('team_id', teamIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!teams?.length,
  });

  useEffect(() => {
    if (teamMessages) {
      setMessages(teamMessages);
    }
  }, [teamMessages]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!teams?.length) return;

    const channel = supabase
      .channel('team-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_messages',
          filter: `team_id=in.(${teams.map(t => t.id).join(',')})`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => msg.id === payload.new.id ? payload.new : msg)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teams]);

  const handleArchiveMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('team_messages')
      .update({ is_archived: true })
      .eq('id', messageId);

    if (error) {
      toast.error("Failed to archive message");
      return;
    }

    toast.success("Message archived successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Team Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams?.map((team) => (
          <Card key={team.id} className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{team.name}</h2>
              <span className="text-sm text-muted-foreground">
                {team.team_members?.length} members
              </span>
            </div>
            
            <Separator />
            
            <MessageList 
              messages={messages.filter(msg => msg.team_id === team.id && !msg.is_archived)}
              onArchive={handleArchiveMessage}
            />

            <MessageForm teamId={team.id} />
          </Card>
        ))}
      </div>
    </div>
  );
}