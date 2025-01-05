import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { EventActions } from "./EventActions";

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: events } = useQuery({
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

  // Get events for the selected date
  const selectedDateEvents = events?.filter((event) => {
    const eventDate = new Date(event.start_time);
    return selectedDate && 
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear();
  });

  // Get all dates that have events
  const eventDates = events?.reduce((dates: Date[], event) => {
    const date = new Date(event.start_time);
    dates.push(date);
    return dates;
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Calendar View</h2>
        <p className="text-sm text-muted-foreground">
          View and manage events in a calendar format.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              event: eventDates,
            }}
            modifiersStyles={{
              event: {
                fontWeight: 'bold',
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))',
              }
            }}
            className="rounded-md border"
          />
        </Card>

        <Card className="flex-1 p-4">
          <div className="space-y-1">
            <h3 className="font-medium">
              Events for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected date'}
            </h3>
            <div className="h-px bg-border" />
          </div>

          <div className="mt-4 space-y-4">
            {selectedDateEvents?.length ? (
              selectedDateEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant={event.status === "published" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(event.start_time), "p")} -{" "}
                        {format(new Date(event.end_time), "p")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {event.roles.map((role: string) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <EventActions event={event} />
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {selectedDate ? "No events scheduled for this date" : "Select a date to view events"}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}