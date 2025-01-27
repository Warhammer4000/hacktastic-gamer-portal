import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Send, Calendar, QrCode, Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditEventDialog } from "./EditEventDialog";
import { EventQRDialog } from "./EventQRDialog";
import { useQueryClient } from "@tanstack/react-query";
import { downloadICS } from "../utils/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventActionsProps {
  event: any;
}

export function EventActions({ event }: EventActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function togglePublishStatus() {
    try {
      setIsPublishing(true);
      const newStatus = event.status === "published" ? "draft" : "published";
      
      const { error } = await supabase
        .from("events")
        .update({ status: newStatus })
        .eq("id", event.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: newStatus === "published" ? "Event published" : "Event unpublished",
        description: `Your event has been ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Error toggling event status:", error);
      toast({
        title: "Error",
        description: "Failed to update event status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  async function deleteEvent() {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEditDialog(true)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
        
        <Button
          variant={event.status === "published" ? "destructive" : "default"}
          size="sm"
          onClick={togglePublishStatus}
          disabled={isPublishing}
        >
          {event.status === "published" ? (
            <EyeOff className="h-4 w-4 mr-2" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          {isPublishing 
            ? "Processing..." 
            : event.status === "published" 
              ? "Unpublish" 
              : "Publish"
          }
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadICS(event)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowQRDialog(true)}
        >
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <EditEventDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        event={event}
      />
      
      <EventQRDialog
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
        event={event}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEvent}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}