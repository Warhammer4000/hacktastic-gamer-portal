import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EmailProvider, EmailProviderSetting } from "../types";

interface ProviderSettingsProps {
  provider: EmailProvider;
  onSettingChange: (settingId: string, value: string) => void;
}

export function ProviderSettings({ provider, onSettingChange }: ProviderSettingsProps) {
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
    <>
      {renderSmtpSettings()}
      {renderSendGridSettings()}
      {renderResendSettings()}
    </>
  );
}