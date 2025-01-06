import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  teamName?: string;
}

export function ChatHeader({ teamName }: ChatHeaderProps) {
  return (
    <div className="p-4 flex justify-between items-center border-b">
      <h2 className="text-lg font-semibold">{teamName}</h2>
    </div>
  );
}