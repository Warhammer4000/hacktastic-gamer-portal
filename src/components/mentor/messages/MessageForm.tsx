import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MessageFormProps {
  teamId: string;
}

export function MessageForm({ teamId }: MessageFormProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
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

  return (
    <div className="flex gap-2">
      <Textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[80px]"
      />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
}