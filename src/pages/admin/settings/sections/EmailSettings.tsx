import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailProvider {
  id: string;
  type: 'resend' | 'sendgrid' | 'mailgun' | 'smtp';
  name: string;
  is_active: boolean;
  is_default: boolean;
  settings?: EmailProviderSetting[];
}

interface EmailProviderSetting {
  id: string;
  provider_id: string;
  key: string;
  value: string | null;
  is_secret: boolean;
}

export function EmailSettings() {
  const { toast } = useToast();

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

  const updateProviderStatus = async (providerId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('email_providers')
      .update({ is_active: isActive })
      .eq('id', providerId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update provider status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Provider status updated successfully",
    });
  };

  const updateProviderSetting = async (settingId: string, value: string) => {
    const { error } = await supabase
      .from('email_provider_settings')
      .update({ value })
      .eq('id', settingId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update setting",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Setting updated successfully",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
                  onCheckedChange={(checked) => updateProviderStatus(provider.id, checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {provider.settings?.map((setting) => (
                <div key={setting.id} className="grid gap-2">
                  <Label htmlFor={setting.id}>{setting.key}</Label>
                  <Input
                    id={setting.id}
                    type={setting.is_secret ? "password" : "text"}
                    value={setting.value || ''}
                    onChange={(e) => updateProviderSetting(setting.id, e.target.value)}
                    placeholder={`Enter ${setting.key}`}
                  />
                </div>
              ))}
              {provider.type === 'smtp' && (
                <Button variant="secondary" className="mt-4">
                  Test Connection
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}