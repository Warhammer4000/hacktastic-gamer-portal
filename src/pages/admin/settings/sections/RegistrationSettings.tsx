import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const RegistrationSettings = () => {
  const queryClient = useQueryClient();
  const [newAdminCode, setNewAdminCode] = useState("");

  // Fetch registration settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["registrationSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update registration settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      const { error } = await supabase
        .from("registration_settings")
        .upsert(newSettings);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrationSettings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update settings");
      console.error("Error updating settings:", error);
    },
  });

  // Update admin registration code
  const updateAdminCode = async () => {
    try {
      const { error } = await supabase.functions.invoke('update-admin-code', {
        body: { code: newAdminCode },
      });

      if (error) throw error;
      
      toast.success("Admin registration code updated successfully");
      setNewAdminCode("");
    } catch (error) {
      toast.error("Failed to update admin registration code");
      console.error("Error updating admin code:", error);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Participant Registration</CardTitle>
          <CardDescription>
            Control participant registration availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="participant-registration">Enable Registration</Label>
            <Switch
              id="participant-registration"
              checked={settings?.participant_registration_enabled}
              onCheckedChange={(checked) =>
                updateSettings.mutate({
                  ...settings,
                  participant_registration_enabled: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="datetime-local"
                value={settings?.participant_registration_start || ""}
                onChange={(e) =>
                  updateSettings.mutate({
                    ...settings,
                    participant_registration_start: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="datetime-local"
                value={settings?.participant_registration_end || ""}
                onChange={(e) =>
                  updateSettings.mutate({
                    ...settings,
                    participant_registration_end: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Registration</CardTitle>
          <CardDescription>
            Control mentor registration availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mentor-registration">Enable Registration</Label>
            <Switch
              id="mentor-registration"
              checked={settings?.mentor_registration_enabled}
              onCheckedChange={(checked) =>
                updateSettings.mutate({
                  ...settings,
                  mentor_registration_enabled: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="datetime-local"
                value={settings?.mentor_registration_start || ""}
                onChange={(e) =>
                  updateSettings.mutate({
                    ...settings,
                    mentor_registration_start: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="datetime-local"
                value={settings?.mentor_registration_end || ""}
                onChange={(e) =>
                  updateSettings.mutate({
                    ...settings,
                    mentor_registration_end: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
              checked={settings?.admin_registration_enabled}
              onCheckedChange={(checked) =>
                updateSettings.mutate({
                  ...settings,
                  admin_registration_enabled: checked,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Admin Registration Code</Label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="New admin registration code"
                value={newAdminCode}
                onChange={(e) => setNewAdminCode(e.target.value)}
              />
              <Button onClick={updateAdminCode} disabled={!newAdminCode}>
                Update Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};