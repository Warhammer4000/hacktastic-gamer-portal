import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateEventDialog } from "./CreateEventDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EventActions } from "./EventActions";

export function EventsTimeline() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Timeline</h2>
        <p className="text-sm text-muted-foreground">
          View events in a chronological timeline.
        </p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-border">
        {events?.map((event) => (
          <div key={event.id} className="relative flex gap-4 pb-8">
            <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 rounded-lg border bg-card p-4 shadow-sm ml-12">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge variant={event.status === "published" ? "default" : "secondary"}>
                  {event.status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{format(new Date(event.start_time), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(event.start_time), "p")} -{" "}
                    {format(new Date(event.end_time), "p")}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {event.roles.map((role: string) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
                <EventActions event={event} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateEventDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
}