import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

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
  className?: string;
}

export function MessageList({ messages, className }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className={cn("p-4", className)}>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4 items-start">
            <Avatar className="w-8 h-8">
              <AvatarImage src={msg.sender?.avatar_url || ''} alt={msg.sender?.full_name || ''} />
              <AvatarFallback>{msg.sender?.full_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{msg.sender?.full_name || 'Unknown'}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(msg.created_at)}
                </span>
              </div>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}