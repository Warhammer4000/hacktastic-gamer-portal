import { format } from "date-fns";
import { Calendar, Clock, Users, Edit, Eye, Trash, QrCode, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
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
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className={cn(
              "flex items-center gap-1",
              event.status === "published" && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Eye className="h-4 w-4" />
            {event.status === "published" ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
          <Button variant="destructive" size="sm" className="flex items-center gap-1">
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}