import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateEventDialog } from "./CreateEventDialog";
import { useState } from "react";

export function EventsList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">All Events</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all events in a list format.
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>
      
      <CreateEventDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
}