import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusItem } from "./StatusItem";
import { UploadStatus } from "../types/upload";

interface StatusListProps {
  statuses: UploadStatus[];
}

export function StatusList({ statuses }: StatusListProps) {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {statuses.map((status, index) => (
          <StatusItem key={`${status.email}-${index}`} status={status} />
        ))}
      </div>
    </ScrollArea>
  );
}