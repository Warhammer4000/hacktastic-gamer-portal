import { format } from "date-fns";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventActions } from "./EventActions";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    status: string;
    roles: string[];
  };
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <Badge 
            variant={event.status === "published" ? "default" : "secondary"}
            className="capitalize"
          >
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.start_time), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(new Date(event.start_time), "p")} -{" "}
              {format(new Date(event.end_time), "p")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {event.roles.map((role) => (
                <Badge key={role} variant="outline" className="capitalize">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <EventActions event={event} />
        </div>
      </CardContent>
    </Card>
  );
}