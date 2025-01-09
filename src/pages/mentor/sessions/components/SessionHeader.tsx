import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Session } from "../../admin/sessions/types/session-form";

interface SessionHeaderProps {
  session: Session;
}

export function SessionHeader({ session }: SessionHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{session.name}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            {session.duration} minutes per session
          </span>
          {session.technology_stacks && (
            <Badge variant="outline">{session.technology_stacks.name}</Badge>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}