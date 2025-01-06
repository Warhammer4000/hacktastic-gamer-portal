import { useState, useEffect } from "react";
import { MessageForm } from "@/components/mentor/messages/MessageForm";
import { MessageList } from "@/components/mentor/messages/MessageList";
import { TeamsList } from "@/components/mentor/chat/TeamsList";
import { ChatHeader } from "@/components/mentor/chat/ChatHeader";
import { TeamMembersList } from "@/components/mentor/chat/TeamMembersList";
import { useMentorTeams } from "@/hooks/useMentorTeams";
import { useMentorChatMessages } from "@/hooks/useMentorChatMessages";
import { useChatActions } from "@/components/mentor/chat/ChatActions";

export default function Messages() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { data: teams } = useMentorTeams();
  const messages = useMentorChatMessages(selectedTeamId);
  const { handleArchiveChat, handleUnarchiveChat } = useChatActions(selectedTeamId);

  useEffect(() => {
    if (teams?.length) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams]);

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