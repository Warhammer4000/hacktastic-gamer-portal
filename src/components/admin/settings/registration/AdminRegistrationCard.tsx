import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface AdminRegistrationCardProps {
  enabled: boolean;
  onEnabledChange: (checked: boolean) => void;
  newAdminCode: string;
  onNewAdminCodeChange: (code: string) => void;
  onUpdateCode: () => void;
}

export function AdminRegistrationCard({
  enabled,
  onEnabledChange,
  newAdminCode,
  onNewAdminCodeChange,
  onUpdateCode,
}: AdminRegistrationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Registration</CardTitle>
        <CardDescription>
          Manage admin registration settings and secret code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="admin-registration">Enable Registration</Label>
          <Switch
            id="admin-registration"
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Admin Registration Code</Label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="New admin registration code"
              value={newAdminCode}
              onChange={(e) => onNewAdminCodeChange(e.target.value)}
            />
            <Button onClick={onUpdateCode} disabled={!newAdminCode}>
              Update Code
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}