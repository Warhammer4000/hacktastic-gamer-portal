import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageForm } from "@/components/participant/messages/MessageForm";
import { MessageList } from "@/components/participant/messages/MessageList";
import { TeamsList } from "@/components/participant/chat/TeamsList";
import { ChatHeader } from "@/components/participant/chat/ChatHeader";
import { TeamMembersList } from "@/components/participant/chat/TeamMembersList";

export default function Chat() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const { data: teams } = useQuery({
    queryKey: ['participant-teams'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          team_members!inner (
            user_id,
            profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('team_members.user_id', user?.id);

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
          id,
          content,
          created_at,
          sender:profiles!team_messages_sender_id_fkey (
            id,
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

  const { data: teamMembers } = useQuery({
    queryKey: ['team-members', selectedTeamId],
    queryFn: async () => {
      if (!selectedTeamId) return [];

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', selectedTeamId);

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
            const { data: newMessage } = await supabase
              .from('team_messages')
              .select(`
                id,
                content,
                created_at,
                sender:profiles!team_messages_sender_id_fkey (
                  id,
                  full_name,
                  avatar_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (newMessage) {
              setMessages(prev => [...prev, newMessage]); // Add new message at the end
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTeamId]);

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
          <TeamMembersList members={teamMembers} />
        </div>
      </div>
    </div>
  );
}
