import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateEventDialog } from "./CreateEventDialog";

export function EventsCalendar() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Calendar View</h2>
        <p className="text-sm text-muted-foreground">
          View events in a calendar format.
        </p>
      </div>

      <div className="min-h-[500px] bg-muted/50 rounded-lg p-4">
        {/* Calendar implementation will be added in the next iteration */}
        <div className="text-center text-muted-foreground pt-20">
          Calendar view coming soon...
        </div>
      </div>

      <CreateEventDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
}
