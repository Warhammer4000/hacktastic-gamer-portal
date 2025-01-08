import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface SessionListProps {
  sessions: Array<{
    id: string;
    name: string;
    description: string;
    duration: number;
    start_date: string;
    end_date: string;
    max_slots_per_mentor: number;
    status: 'active' | 'inactive';
    technology_stacks: {
      id: string;
      name: string;
      icon_url: string;
    } | null;
    session_availabilities: Array<{
      id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
    }>;
  }>;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SessionList({ sessions }: SessionListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{session.name}</CardTitle>
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
            </div>
            <CardDescription>{session.description}</CardDescription>
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
              {session.session_availabilities.map((availability) => (
                <div key={availability.id} className="text-sm text-muted-foreground">
                  {DAYS[availability.day_of_week]}: {availability.start_time} - {availability.end_time}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}