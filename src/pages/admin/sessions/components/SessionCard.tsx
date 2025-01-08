import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Session } from "../types/session-form";
import { SessionCardHeader } from "./session-card/SessionCardHeader";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface SessionCardProps {
  session: Session;
  onEdit: (session: Session) => void;
}

export function SessionCard({ session, onEdit }: SessionCardProps) {
  return (
    <Card>
      <CardHeader>
        <SessionCardHeader session={session} onEdit={onEdit} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          {session.duration} minutes per session
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(session.start_date), 'PP')} - {format(new Date(session.end_date), 'PP')}
        </div>
        {session.technology_stacks && (
          <Badge variant="outline" className="mt-2">
            {session.technology_stacks.name}
          </Badge>
        )}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Available Times:</p>
          {session.session_availabilities?.map((availability: any) => (
            <div key={availability.id} className="text-sm text-muted-foreground">
              {DAYS[availability.day_of_week]}: {availability.start_time} - {availability.end_time}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}