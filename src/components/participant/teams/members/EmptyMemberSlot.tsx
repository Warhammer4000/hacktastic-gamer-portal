import { User } from "lucide-react";

export function EmptyMemberSlot() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed">
      <User className="h-5 w-5 text-muted-foreground" />
      <span className="text-muted-foreground">Empty Slot</span>
    </div>
  );
}