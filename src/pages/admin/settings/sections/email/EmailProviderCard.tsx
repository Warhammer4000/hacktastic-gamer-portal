import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailProvider, EmailProviderSetting } from "./types";
import { useEmailProviderActions } from "./useEmailProviderActions";
import { Checkbox } from "@/components/ui/checkbox";

interface EmailProviderCardProps {
  provider: EmailProvider;
  onStatusChange: (providerId: string, isActive: boolean) => void;
  onSettingChange: (settingId: string, value: string) => void;
  onTestConnection: (provider: EmailProvider) => Promise<void>;
  onSaveConfiguration: (provider: EmailProvider) => Promise<void>;
  testedProviders: Set<string>;
}

export function EmailProviderCard({
  provider,
  onStatusChange,
  onSettingChange,
  onTestConnection,
  onSaveConfiguration,
  testedProviders,
}: EmailProviderCardProps) {
  const { getProviderIcon, getProviderGuide } = useEmailProviderActions();
  const Icon = getProviderIcon(provider.type);
  const guide = getProviderGuide(provider.type);
  const hasValidSettings = provider.settings?.every(s => s.value);
  const canSave = testedProviders.has(provider.id);

  const getSettingByKey = (key: string) => {
    return provider.settings?.find(s => s.key === key);
  };

  const renderSmtpSettings = () => {
    if (provider.type !== 'smtp') return null;

    const hostSetting = getSettingByKey('host');
    const portSetting = getSettingByKey('port');
    const usernameSetting = getSettingByKey('username');
    const passwordSetting = getSettingByKey('password');
    const secureSetting = getSettingByKey('secure');

    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor={hostSetting?.id}>SMTP Host</Label>
          <Input
            id={hostSetting?.id}
            value={hostSetting?.value || ''}
            onChange={(e) => onSettingChange(hostSetting?.id || '', e.target.value)}
            placeholder="smtp.gmail.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={portSetting?.id}>SMTP Port</Label>
          <Input
            id={portSetting?.id}
            type="number"
            value={portSetting?.value || ''}
            onChange={(e) => onSettingChange(portSetting?.id || '', e.target.value)}
            placeholder="587"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={usernameSetting?.id}>SMTP Username</Label>
          <Input
            id={usernameSetting?.id}
            value={usernameSetting?.value || ''}
            onChange={(e) => onSettingChange(usernameSetting?.id || '', e.target.value)}
            placeholder="your-email@gmail.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={passwordSetting?.id}>SMTP Password</Label>
          <Input
            id={passwordSetting?.id}
            type="password"
            value={passwordSetting?.value || ''}
            onChange={(e) => onSettingChange(passwordSetting?.id || '', e.target.value)}
            placeholder="Enter SMTP password or app-specific password"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={secureSetting?.id}
            checked={secureSetting?.value === 'true'}
            onCheckedChange={(checked) => 
              onSettingChange(secureSetting?.id || '', checked ? 'true' : 'false')
            }
          />
          <label
            htmlFor={secureSetting?.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use SSL/TLS
          </label>
        </div>
      </div>
    );
  };

  const renderSendGridSettings = () => {
    if (provider.type !== 'sendgrid') return null;

    const apiKeySetting = getSettingByKey('api_key');
    const fromEmailSetting = getSettingByKey('from_email');

    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor={apiKeySetting?.id}>API Key</Label>
          <Input
            id={apiKeySetting?.id}
            type="password"
            value={apiKeySetting?.value || ''}
            onChange={(e) => onSettingChange(apiKeySetting?.id || '', e.target.value)}
            placeholder="Enter your SendGrid API key"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={fromEmailSetting?.id}>From Email</Label>
          <Input
            id={fromEmailSetting?.id}
            type="email"
            value={fromEmailSetting?.value || ''}
            onChange={(e) => onSettingChange(fromEmailSetting?.id || '', e.target.value)}
            placeholder="Enter verified sender email"
          />
        </div>
      </div>
    );
  };

  const renderResendSettings = () => {
    if (provider.type !== 'resend') return null;

    const apiKeySetting = getSettingByKey('api_key');
    const fromEmailSetting = getSettingByKey('from_email');
    const fromNameSetting = getSettingByKey('from_name');

    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor={apiKeySetting?.id}>API Key</Label>
          <Input
            id={apiKeySetting?.id}
            type="password"
            value={apiKeySetting?.value || ''}
            onChange={(e) => onSettingChange(apiKeySetting?.id || '', e.target.value)}
            placeholder="Enter your Resend API key"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={fromEmailSetting?.id}>From Email</Label>
          <Input
            id={fromEmailSetting?.id}
            type="email"
            value={fromEmailSetting?.value || ''}
            onChange={(e) => onSettingChange(fromEmailSetting?.id || '', e.target.value)}
            placeholder="noreply@yourdomain.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={fromNameSetting?.id}>From Name</Label>
          <Input
            id={fromNameSetting?.id}
            value={fromNameSetting?.value || ''}
            onChange={(e) => onSettingChange(fromNameSetting?.id || '', e.target.value)}
            placeholder="Your Company Name"
          />
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>{provider.name}</CardTitle>
              <CardDescription>
                {provider.is_default ? 'Default Provider' : 'Additional Provider'}
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={provider.is_active}
            onCheckedChange={(checked) => onStatusChange(provider.id, checked)}
          />
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4", !provider.is_active && "hidden")}>
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
        
        {provider.type === 'smtp' && renderSmtpSettings()}
        {provider.type === 'sendgrid' && renderSendGridSettings()}
        {provider.type === 'resend' && renderResendSettings()}
        
        <div className="flex gap-4 mt-4">
          <Button 
            variant="secondary" 
            onClick={() => onTestConnection(provider)}
            disabled={!hasValidSettings}
          >
            Test Connection
          </Button>
          
          <Button
            onClick={() => onSaveConfiguration(provider)}
            disabled={!canSave}
          >
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
