import { Edit, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventActions } from "../hooks/useEventActions";

type EventActionsProps = {
  event: {
    id: string;
    status: string;
  };
};

export function EventActions({ event }: EventActionsProps) {
  const { handleEdit, handlePublish, handleExport } = useEventActions();

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-9 px-3 py-2"
        onClick={() => handleEdit(event.id)}
      >
        <Edit className="h-4 w-4" />
        <span className="ml-2">Edit</span>
      </Button>

      <Button
        variant={event.status === "published" ? "default" : "secondary"}
        size="sm"
        className="h-9 px-3 py-2"
        onClick={() => handlePublish(event.id)}
      >
        <Eye className="h-4 w-4" />
        <span className="ml-2">
          {event.status === "published" ? "Unpublish" : "Publish"}
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-9 px-3 py-2"
        onClick={() => handleExport(event.id)}
      >
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
}