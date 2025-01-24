import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { EmailProviderCard } from "./email/EmailProviderCard";
import { EmailProvider } from "./email/types";

export function EmailSettings() {
  const queryClient = useQueryClient();
  const [testedProviders, setTestedProviders] = useState<Set<string>>(new Set());
  
  const { data: providers, isLoading } = useQuery({
    queryKey: ['emailProviders'],
    queryFn: async () => {
      const { data: providers, error } = await supabase
        .from('email_providers')
        .select(`
          *,
          settings:email_provider_settings(*)
        `);

      if (error) throw error;
      return providers as EmailProvider[];
    },
  });

  const updateProviderStatus = useMutation({
    mutationFn: async ({ providerId, isActive }: { providerId: string; isActive: boolean }) => {
      // If trying to disable a provider, check if it's the last active one
      if (!isActive) {
        const activeProviders = providers?.filter(p => p.is_active && p.id !== providerId) || [];
        if (activeProviders.length === 0) {
          throw new Error("At least one provider must remain active");
        }
      }

      if (isActive) {
        const { error: disableError } = await supabase
          .from('email_providers')
          .update({ is_active: false })
          .neq('id', providerId);

        if (disableError) throw disableError;
      }

      const { error } = await supabase
        .from('email_providers')
        .update({ is_active: isActive })
        .eq('id', providerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailProviders'] });
      toast.success("Provider status updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update provider status");
    }
  });

  const updateProviderSetting = useMutation({
    mutationFn: async ({ settingId, value }: { settingId: string; value: string }) => {
      const { error } = await supabase
        .from('email_provider_settings')
        .update({ value })
        .eq('id', settingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailProviders'] });
      toast.success("Setting updated successfully");
    },
    onError: () => {
      toast.error("Failed to update setting");
    }
  });

  const testConnection = async (provider: EmailProvider) => {
    const settings = provider.settings?.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string | null>);

    try {
      toast.promise(
        (async () => {
          const { data, error } = await supabase.functions.invoke('test-email-provider', {
            body: {
              type: provider.type,
              settings
            }
          });

          if (error) throw new Error(error.message);
          if (!data?.success) throw new Error('Connection test failed');

          setTestedProviders(prev => new Set([...prev, provider.id]));
          return "Connection test successful!";
        })(),
        {
          loading: 'Testing connection...',
          success: (message) => message,
          error: (err) => `Connection test failed: ${err.message}`
        }
      );
    } catch (error) {
      console.error('Connection test error:', error);
    }
  };

  const saveConfiguration = async (provider: EmailProvider) => {
    if (!testedProviders.has(provider.id)) {
      toast.error("Please test the connection before saving");
      return;
    }

    try {
      for (const setting of provider.settings || []) {
        await updateProviderSetting.mutateAsync({
          settingId: setting.id,
          value: setting.value || ''
        });
      }
      toast.success("Configuration saved successfully");
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Email Providers</h3>
        <p className="text-sm text-muted-foreground">
          Configure your email service providers and their settings.
        </p>
      </div>

      <div className="grid gap-6">
        {providers?.map((provider) => (
          <EmailProviderCard
            key={provider.id}
            provider={provider}
            onStatusChange={(providerId, isActive) => 
              updateProviderStatus.mutate({ providerId, isActive })
            }
            onSettingChange={(settingId, value) => 
              updateProviderSetting.mutate({ settingId, value })
            }
            onTestConnection={testConnection}
            onSaveConfiguration={saveConfiguration}
            testedProviders={testedProviders}
          />
        ))}
      </div>
    </div>
  );
}