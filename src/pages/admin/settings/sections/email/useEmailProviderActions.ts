import { Mail, Send, Server } from "lucide-react";
import { EmailProvider } from "./types";

export function useEmailProviderActions() {
  const getProviderIcon = (type: EmailProvider['type']) => {
    switch (type) {
      case 'resend':
        return Send;
      case 'sendgrid':
        return Mail;
      case 'smtp':
        return Server;
      default:
        return Mail;
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
      case 'smtp':
        return {
          description: 'Configure your SMTP settings using your email service provider credentials. Common providers include Gmail, Outlook, or your custom email server.'
        };
      default:
        return { description: '' };
    }
  };

  const getDefaultSettings = (type: EmailProvider['type']) => {
    switch (type) {
      case 'smtp':
        return [
          { key: 'host', value: '', is_secret: false },
          { key: 'port', value: '587', is_secret: false },
          { key: 'username', value: '', is_secret: false },
          { key: 'password', value: '', is_secret: true },
          { key: 'secure', value: 'false', is_secret: false }
        ];
      case 'resend':
        return [
          { key: 'api_key', value: '', is_secret: true }
        ];
      case 'sendgrid':
        return [
          { key: 'api_key', value: '', is_secret: true }
        ];
      default:
        return [];
    }
  };

  return {
    getProviderIcon,
    getProviderGuide,
    getDefaultSettings
  };
}