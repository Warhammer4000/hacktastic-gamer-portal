import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";

interface MessageListProps {
  messages: Array<{
    id: string;
    content: string;
    created_at: string;
    sender: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }>;
  onArchive: (messageId: string) => void;
}

export function MessageList({ messages, onArchive }: MessageListProps) {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4 items-start">
            <Avatar className="w-8 h-8">
              <AvatarImage src={msg.sender?.avatar_url || ''} alt={msg.sender?.full_name || ''} />
              <AvatarFallback>{msg.sender?.full_name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{msg.sender?.full_name || 'Unknown'}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(msg.created_at)}
                </span>
              </div>
              <p className="text-sm">{msg.content}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(msg.id)}
              >
                Archive
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}