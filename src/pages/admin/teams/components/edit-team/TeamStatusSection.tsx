import { Label } from "@/components/ui/label";
import { TeamStateSelect } from "../TeamStateSelect";

interface TeamStatusSectionProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export function TeamStatusSection({ status, onStatusChange }: TeamStatusSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Team Status</Label>
      <TeamStateSelect
        currentState={status}
        onStateChange={onStatusChange}
      />
    </div>
  );
}