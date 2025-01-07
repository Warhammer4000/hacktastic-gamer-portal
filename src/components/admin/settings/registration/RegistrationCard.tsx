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
  // Function to format date string to datetime-local format
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Format: YYYY-MM-DDThh:mm
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Function to handle date changes and ensure correct format
  const handleDateChange = (value: string, onChange: (date: string) => void) => {
    try {
      // Convert the input value to ISO string format
      const date = new Date(value);
      onChange(date.toISOString());
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  };

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
              value={formatDateForInput(startDate)}
              onChange={(e) => handleDateChange(e.target.value, onStartDateChange)}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="datetime-local"
              value={formatDateForInput(endDate)}
              onChange={(e) => handleDateChange(e.target.value, onEndDateChange)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}