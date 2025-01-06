import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function Messages() {
  const [message, setMessage] = useState("");
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

  const handleSendMessage = async (teamId: string) => {
    if (!message.trim()) return;

    const { error } = await supabase
      .from('team_messages')
      .insert({
        team_id: teamId,
        content: message,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
      });

    if (error) {
      toast.error("Failed to send message");
      return;
    }

    setMessage("");
    toast.success("Message sent successfully");
  };

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
          <div key={team.id} className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{team.name}</h2>
              <span className="text-sm text-muted-foreground">
                {team.team_members?.length} members
              </span>
            </div>
            
            <Separator />
            
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {messages
                  .filter(msg => msg.team_id === team.id && !msg.is_archived)
                  .map((msg) => (
                    <div key={msg.id} className="flex gap-4 items-start">
                      <img
                        src={msg.sender.avatar_url || "/placeholder.svg"}
                        alt={msg.sender.full_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{msg.sender.full_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveMessage(msg.id)}
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px]"
              />
              <Button onClick={() => handleSendMessage(team.id)}>Send</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}