import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface RegistrationCardProps {
  title: string;
  description: string;
  enabled: boolean;
  startDate: string;
  endDate: string;
  onEnabledChange: (checked: boolean) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function RegistrationCard({
  title,
  description,
  enabled,
  startDate,
  endDate,
  onEnabledChange,
  onStartDateChange,
  onEndDateChange,
}: RegistrationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${title.toLowerCase()}-registration`}>Enable Registration</Label>
          <Switch
            id={`${title.toLowerCase()}-registration`}
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="datetime-local"
              value={startDate || ""}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="datetime-local"
              value={endDate || ""}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}