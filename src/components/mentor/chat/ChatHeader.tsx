import { Button } from "@/components/ui/button";
import { Archive, Undo2 } from "lucide-react";
import { toast } from "sonner";

interface ChatHeaderProps {
  teamName?: string;
  onArchiveChat: () => void;
  onUnarchiveChat: () => void;
  isArchived?: boolean;
}

export function ChatHeader({ 
  teamName, 
  onArchiveChat, 
  onUnarchiveChat,
  isArchived 
}: ChatHeaderProps) {
  return (
    <div className="p-4 flex justify-between items-center border-b">
      <h2 className="text-lg font-semibold">{teamName}</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={isArchived ? onUnarchiveChat : onArchiveChat}
      >
        {isArchived ? (
          <>
            <Undo2 className="w-4 h-4 mr-2" />
            Unarchive Chat
          </>
        ) : (
          <>
            <Archive className="w-4 h-4 mr-2" />
            Archive Chat
          </>
        )}
      </Button>
    </div>
  );
}