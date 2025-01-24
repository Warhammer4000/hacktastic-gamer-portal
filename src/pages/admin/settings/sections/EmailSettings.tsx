import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface EmailProvider {
  id: string;
  type: 'resend' | 'sendgrid' | 'mailgun' | 'smtp';
  name: string;
  is_active: boolean;
  is_default: boolean;
  settings?: EmailProviderSetting[];
  hasTestedConnection?: boolean;
}

interface EmailProviderSetting {
  id: string;
  provider_id: string;
  key: string;
  value: string | null;
  is_secret: boolean;
}

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
    onError: () => {
      toast.error("Failed to update provider status");
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

  const saveConfiguration = async (provider: EmailProvider) => {
    if (!testedProviders.has(provider.id)) {
      toast.error("Please test the connection before saving");
      return;
    }

    try {
      // Save all settings for this provider
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

  const testConnection = async (provider: EmailProvider) => {
    const settings = provider.settings?.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string | null>);

    try {
      toast.promise(
        (async () => {
          switch (provider.type) {
            case 'resend':
              const response = await fetch('/api/test-resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
              });
              if (!response.ok) throw new Error('Failed to connect to Resend');
              break;

            case 'sendgrid':
              const sgResponse = await fetch('/api/test-sendgrid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
              });
              if (!sgResponse.ok) throw new Error('Failed to connect to SendGrid');
              break;

            case 'smtp':
              const smtpResponse = await fetch('/api/test-smtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
              });
              if (!smtpResponse.ok) throw new Error('Failed to connect to SMTP server');
              break;

            default:
              throw new Error('Unsupported provider type');
          }
          setTestedProviders(prev => new Set([...prev, provider.id]));
        })(),
        {
          loading: 'Testing connection...',
          success: 'Connection test successful!',
          error: (err) => `Connection test failed: ${err.message}`
        }
      );
    } catch (error) {
      console.error('Connection test error:', error);
    }
  };

  const getProviderGuide = (type: EmailProvider['type']) => {
    switch (type) {
      case 'resend':
        return {
          url: 'https://resend.com/api-keys',
          description: 'Get your API key from the Resend dashboard under API Keys section.'
        };
      case 'sendgrid':
        return {
          url: 'https://app.sendgrid.com/settings/api_keys',
          description: 'Create an API key in the SendGrid dashboard under Settings > API Keys.'
        };
      case 'mailgun':
        return {
          url: 'https://app.mailgun.com/app/account/security/api_keys',
          description: 'Find your API key in the Mailgun dashboard under Account Settings > API Keys.'
        };
      case 'smtp':
        return {
          description: 'Configure your SMTP settings using your email service provider credentials.'
        };
      default:
        return { description: '' };
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
        {providers?.map((provider) => {
          const guide = getProviderGuide(provider.type);
          const hasValidSettings = provider.settings?.every(s => s.value);
          const canSave = testedProviders.has(provider.id);
          
          return (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{provider.name}</CardTitle>
                    <CardDescription>
                      {provider.is_default ? 'Default Provider' : 'Additional Provider'}
                    </CardDescription>
                  </div>
                  <Switch
                    checked={provider.is_active}
                    onCheckedChange={(checked) => 
                      updateProviderStatus.mutate({ providerId: provider.id, isActive: checked })
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide.description && (
                  <Alert>
                    <AlertDescription className="flex items-center gap-2">
                      {guide.description}
                      {guide.url && (
                        <a 
                          href={guide.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          Get API Key
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {provider.settings?.map((setting) => (
                  <div key={setting.id} className="grid gap-2">
                    <Label htmlFor={setting.id}>{setting.key}</Label>
                    <Input
                      id={setting.id}
                      type={setting.is_secret ? "password" : "text"}
                      value={setting.value || ''}
                      onChange={(e) => updateProviderSetting.mutate({
                        settingId: setting.id,
                        value: e.target.value
                      })}
                      placeholder={`Enter ${setting.key}`}
                    />
                  </div>
                ))}
                
                <div className="flex gap-4 mt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => testConnection(provider)}
                    disabled={!hasValidSettings}
                  >
                    Test Connection
                  </Button>
                  
                  <Button
                    onClick={() => saveConfiguration(provider)}
                    disabled={!canSave}
                  >
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}