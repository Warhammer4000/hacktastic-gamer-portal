import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, Clock } from "lucide-react";
import { EventsList } from "./components/EventsList";
import { EventsTimeline } from "./components/EventsTimeline";
import { EventsCalendar } from "./components/EventsCalendar";

export default function EventsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">Manage and schedule events for mentors and participants.</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <EventsList />
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <EventsCalendar />
        </TabsContent>
        <TabsContent value="timeline" className="space-y-4">
          <EventsTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
}