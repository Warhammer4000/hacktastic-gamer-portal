import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditEventDialog } from "./EditEventDialog";
import { useQueryClient } from "@tanstack/react-query";

interface EventActionsProps {
  event: any; // We'll type this properly in a future iteration
}

export function EventActions({ event }: EventActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function publishEvent() {
    try {
      setIsPublishing(true);
      
      const { error } = await supabase
        .from("events")
        .update({ status: "published" })
        .eq("id", event.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: "Event published",
        description: "Your event has been published successfully.",
      });
    } catch (error) {
      console.error("Error publishing event:", error);
      toast({
        title: "Error",
        description: "Failed to publish event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowEditDialog(true)}
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Edit
      </Button>
      {event.status === "draft" && (
        <Button
          variant="default"
          size="sm"
          onClick={publishEvent}
          disabled={isPublishing}
        >
          <Send className="h-4 w-4 mr-2" />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      )}
      <EditEventDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        event={event}
      />
    </div>
  );
}