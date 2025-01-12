import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TeamStatus } from "./types";

interface TeamStatusSectionProps {
  status: TeamStatus;
  onStatusChange: (status: TeamStatus) => Promise<void>;
}

export function TeamStatusSection({ status, onStatusChange }: TeamStatusSectionProps) {
  const statuses: Array<{ value: TeamStatus; label: string }> = [
    { value: "draft", label: "Draft" },
    { value: "open", label: "Open" },
    { value: "locked", label: "Locked" },
    { value: "active", label: "Active" },
    { value: "pending_mentor", label: "Pending Mentor" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Team Status</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={status}
          onValueChange={(value) => onStatusChange(value as TeamStatus)}
          className="space-y-2"
        >
          {statuses.map((statusOption) => (
            <div key={statusOption.value} className="flex items-center space-x-2">
              <RadioGroupItem value={statusOption.value} id={`status-${statusOption.value}`} />
              <Label htmlFor={`status-${statusOption.value}`}>{statusOption.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}