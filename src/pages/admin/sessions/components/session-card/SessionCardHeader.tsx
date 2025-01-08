import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Session } from "../../types/session-form";
import { SessionCardActions } from "./SessionCardActions";

interface SessionCardHeaderProps {
  session: Session;
  onEdit: (session: Session) => void;
}

export function SessionCardHeader({ session, onEdit }: SessionCardHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-xl">{session.name}</CardTitle>
        <SessionCardActions session={session} onEdit={onEdit} />
      </div>
      <Badge 
        variant={session.status === 'active' ? 'default' : 'destructive'}
        className={session.status === 'active' ? 'bg-green-500' : 'bg-red-500'}
      >
        {session.status}
      </Badge>
    </div>
  );
}