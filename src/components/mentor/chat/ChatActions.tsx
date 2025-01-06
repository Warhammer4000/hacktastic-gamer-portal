import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatActionsProps {
  teamId: string;
  onSuccess: () => void;
}

export function useChatActions(teamId: string | null) {
  const handleArchiveChat = async () => {
    if (!teamId) return;

    const { error } = await supabase
      .from('team_messages')
      .update({ is_archived: true })
      .eq('team_id', teamId);

    if (error) {
      toast.error("Failed to archive chat");
      return;
    }

    toast.success("Chat archived successfully");
    return [];
  };

  const handleUnarchiveChat = async () => {
    if (!teamId) return;

    const { error } = await supabase
      .from('team_messages')
      .update({ is_archived: false })
      .eq('team_id', teamId);

    if (error) {
      toast.error("Failed to unarchive chat");
      return;
    }

    const { data: messages, error: fetchError } = await supabase
      .from('team_messages')
      .select(`
        *,
        sender:profiles!team_messages_sender_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (fetchError) {
      toast.error("Failed to fetch messages");
      return;
    }

    toast.success("Chat unarchived successfully");
    return messages || [];
  };

  return {
    handleArchiveChat,
    handleUnarchiveChat
  };
}