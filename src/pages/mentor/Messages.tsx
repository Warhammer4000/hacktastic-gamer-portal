import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Archive, Users } from "lucide-react";
import { toast } from "sonner";
import { MessageForm } from "@/components/mentor/messages/MessageForm";
import { MessageList } from "@/components/mentor/messages/MessageList";

export default function Messages() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
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

  useEffect(() => {
    if (teams?.length) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams]);

  // Fetch messages for selected team
  const { data: teamMessages } = useQuery({
    queryKey: ['team-messages', selectedTeamId],
    queryFn: async () => {
      if (!selectedTeamId) return [];

      const { data, error } = await supabase
        .from('team_messages')
        .select(`
          *,
          sender:profiles!team_messages_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', selectedTeamId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTeamId,
  });

  useEffect(() => {
    if (teamMessages) {
      setMessages(teamMessages);
    }
  }, [teamMessages]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!selectedTeamId) return;

    const channel = supabase
      .channel('team-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_messages',
          filter: `team_id=eq.${selectedTeamId}`,
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
  }, [selectedTeamId]);

  const handleArchiveChat = async () => {
    if (!selectedTeamId) return;

    const { error } = await supabase
      .from('team_messages')
      .update({ is_archived: true })
      .eq('team_id', selectedTeamId);

    if (error) {
      toast.error("Failed to archive chat");
      return;
    }

    setMessages([]);
    toast.success("Chat archived successfully");
  };

  const currentTeam = teams?.find(team => team.id === selectedTeamId);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Teams List */}
        <div className="col-span-3 glass-card rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Your Teams</h2>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              {teams?.map((team) => (
                <Button
                  key={team.id}
                  variant={selectedTeamId === team.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTeamId(team.id)}
                >
                  {team.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="col-span-6 glass-card rounded-lg">
          {selectedTeamId ? (
            <div className="h-full flex flex-col">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-semibold">{currentTeam?.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleArchiveChat}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Chat
                </Button>
              </div>
              
              <MessageList 
                messages={messages}
                className="flex-1"
              />

              <div className="p-4 border-t">
                <MessageForm teamId={selectedTeamId} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a team to start messaging
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="col-span-3 glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Team Members</h2>
          </div>
          <Separator className="mb-4" />
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {currentTeam?.team_members.map((member: any) => (
                <div key={member.user_id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {member.profiles?.avatar_url ? (
                      <img 
                        src={member.profiles.avatar_url} 
                        alt={member.profiles.full_name || ''} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {member.profiles?.full_name?.[0] || '?'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {member.profiles?.full_name || 'Unknown User'}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}