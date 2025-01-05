import { format } from "date-fns";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventActions } from "./EventActions";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status: string;
    roles: string[];
  };
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
          </div>
          <Badge variant={event.status === "published" ? "default" : "secondary"}>
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{format(new Date(event.start_time), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(event.start_time), "p")} -{" "}
                {format(new Date(event.end_time), "p")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <div className="flex gap-1">
                {event.roles.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <EventActions event={event} />
        </div>
      </CardContent>
    </Card>
  );
}