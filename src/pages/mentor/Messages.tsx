import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageForm } from "@/components/mentor/messages/MessageForm";
import { MessageList } from "@/components/mentor/messages/MessageList";
import { TeamsList } from "@/components/mentor/chat/TeamsList";
import { ChatHeader } from "@/components/mentor/chat/ChatHeader";
import { TeamMembersList } from "@/components/mentor/chat/TeamMembersList";

export default function Messages() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

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

  // Fetch messages for selected team - Note the ascending order
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
        .order('created_at', { ascending: true }); // Changed to ascending

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
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the complete message data including sender profile
            const { data: newMessage } = await supabase
              .from('team_messages')
              .select(`
                *,
                sender:profiles!team_messages_sender_id_fkey (
                  full_name,
                  avatar_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (newMessage) {
              setMessages(prev => [...prev, newMessage]); // Add new message at the end
            }
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

  const handleUnarchiveChat = async () => {
    if (!selectedTeamId) return;

    const { error } = await supabase
      .from('team_messages')
      .update({ is_archived: false })
      .eq('team_id', selectedTeamId);

    if (error) {
      toast.error("Failed to unarchive chat");
      return;
    }

    // Refresh messages
    const { data: messages, error: fetchError } = await supabase
      .from('team_messages')
      .select(`
        *,
        sender:profiles!team_messages_sender_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('team_id', selectedTeamId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      toast.error("Failed to fetch messages");
      return;
    }

    setMessages(messages || []);
    toast.success("Chat unarchived successfully");
  };

  const currentTeam = teams?.find(team => team.id === selectedTeamId);

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-3 glass-card rounded-lg">
          <TeamsList
            teams={teams}
            selectedTeamId={selectedTeamId}
            onTeamSelect={setSelectedTeamId}
          />
        </div>

        <div className="col-span-6 glass-card rounded-lg flex flex-col">
          {selectedTeamId ? (
            <>
              <ChatHeader
                teamName={currentTeam?.name}
                onArchiveChat={handleArchiveChat}
                onUnarchiveChat={handleUnarchiveChat}
                isArchived={messages.length === 0}
              />
              
              <MessageList 
                messages={messages}
                className="flex-1"
              />

              <div className="p-4 border-t">
                <MessageForm teamId={selectedTeamId} />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a team to start messaging
            </div>
          )}
        </div>

        <div className="col-span-3 glass-card rounded-lg">
          <TeamMembersList members={currentTeam?.team_members} />
        </div>
      </div>
    </div>
  );
}