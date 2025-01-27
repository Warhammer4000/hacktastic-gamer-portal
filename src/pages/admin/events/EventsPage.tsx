import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, Clock, LayoutGrid } from "lucide-react";
import { EventsList } from "./components/EventsList";
import { EventsTimeline } from "./components/EventsTimeline";
import { EventsCalendar } from "./components/EventsCalendar";
import { CreateEventSidebar } from "./components/CreateEventSidebar";

export default function EventsPage() {
  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage and schedule events for mentors and participants.</p>
        </div>

        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Cards
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
          <TabsContent value="cards" className="space-y-4">
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
      <CreateEventSidebar />
    </div>
  );
}