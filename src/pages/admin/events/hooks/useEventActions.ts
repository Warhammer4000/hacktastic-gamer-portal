import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEdit = async (eventId: string) => {
    toast({
      title: "Edit Event",
      description: "This feature is coming soon.",
    });
  };

  const handlePublish = async (eventId: string) => {
    try {
      const { data: event } = await supabase
        .from("events")
        .select("status")
        .eq("id", eventId)
        .single();

      const newStatus = event?.status === "published" ? "draft" : "published";

      const { error } = await supabase
        .from("events")
        .update({ status: newStatus })
        .eq("id", eventId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["events"] });

      toast({
        title: `Event ${newStatus === "published" ? "Published" : "Unpublished"}`,
        description: `The event has been ${newStatus === "published" ? "published" : "unpublished"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating event status:", error);
      toast({
        title: "Error",
        description: "Failed to update event status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (eventId: string) => {
    toast({
      title: "Export Event",
      description: "This feature is coming soon.",
    });
  };

  return {
    handleEdit,
    handlePublish,
    handleExport,
  };
}