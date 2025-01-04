import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RegistrationCard } from "@/components/admin/settings/registration/RegistrationCard";
import { AdminRegistrationCard } from "@/components/admin/settings/registration/AdminRegistrationCard";

export const RegistrationSettings = () => {
  const queryClient = useQueryClient();
  const [newAdminCode, setNewAdminCode] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["registrationSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_settings")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

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
      <RegistrationCard
        title="Participant Registration"
        description="Control participant registration availability"
        enabled={settings?.participant_registration_enabled}
        startDate={settings?.participant_registration_start}
        endDate={settings?.participant_registration_end}
        onEnabledChange={(checked) =>
          updateSettings.mutate({
            ...settings,
            participant_registration_enabled: checked,
          })
        }
        onStartDateChange={(date) =>
          updateSettings.mutate({
            ...settings,
            participant_registration_start: date,
          })
        }
        onEndDateChange={(date) =>
          updateSettings.mutate({
            ...settings,
            participant_registration_end: date,
          })
        }
      />

      <RegistrationCard
        title="Mentor Registration"
        description="Control mentor registration availability"
        enabled={settings?.mentor_registration_enabled}
        startDate={settings?.mentor_registration_start}
        endDate={settings?.mentor_registration_end}
        onEnabledChange={(checked) =>
          updateSettings.mutate({
            ...settings,
            mentor_registration_enabled: checked,
          })
        }
        onStartDateChange={(date) =>
          updateSettings.mutate({
            ...settings,
            mentor_registration_start: date,
          })
        }
        onEndDateChange={(date) =>
          updateSettings.mutate({
            ...settings,
            mentor_registration_end: date,
          })
        }
      />

      <AdminRegistrationCard
        enabled={settings?.admin_registration_enabled}
        onEnabledChange={(checked) =>
          updateSettings.mutate({
            ...settings,
            admin_registration_enabled: checked,
          })
        }
        newAdminCode={newAdminCode}
        onNewAdminCodeChange={setNewAdminCode}
        onUpdateCode={updateAdminCode}
      />
    </div>
  );
}