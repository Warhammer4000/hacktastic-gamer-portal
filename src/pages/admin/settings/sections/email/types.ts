export interface EmailProvider {
  id: string;
  type: 'resend' | 'sendgrid' | 'smtp';
  name: string;
  is_active: boolean;
  is_default: boolean;
  settings?: EmailProviderSetting[];
}

export interface EmailProviderSetting {
  id: string;
  provider_id: string;
  key: string;
  value: string | null;
  is_secret: boolean;
}