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
  // Group availabilities by day
  const availabilitiesByDay = session.session_availabilities?.reduce((acc, availability) => {
    const day = availability.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(availability);
    return acc;
  }, {} as Record<number, typeof session.session_availabilities>);

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
          {Object.entries(availabilitiesByDay || {}).map(([day, slots]) => (
            <div key={day} className="text-sm text-muted-foreground">
              <div className="font-medium">{DAYS[parseInt(day)]}</div>
              <div className="ml-4 space-y-1">
                {slots?.sort((a, b) => a.slot_index - b.slot_index).map((slot) => (
                  <div key={slot.id}>
                    {slot.start_time} - {slot.end_time}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}