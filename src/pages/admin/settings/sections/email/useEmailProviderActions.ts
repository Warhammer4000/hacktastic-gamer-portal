import { Mail, Send, Server, Mailbox } from "lucide-react";
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
      case 'mailgun':
        return Mailbox;
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
          description: 'Create an API key in the SendGrid dashboard under Settings > API Keys. You\'ll also need to verify your sender email.'
        };
      case 'mailgun':
        return {
          url: 'https://app.mailgun.com/app/account/security/api_keys',
          description: 'You\'ll need your API key from Mailgun and a verified domain. Make sure to use the private API key, not the public one.'
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
          { key: 'api_key', value: '', is_secret: true },
          { key: 'from_email', value: '', is_secret: false },
          { key: 'from_name', value: '', is_secret: false }
        ];
      case 'sendgrid':
        return [
          { key: 'api_key', value: '', is_secret: true },
          { key: 'from_email', value: '', is_secret: false }
        ];
      case 'mailgun':
        return [
          { key: 'api_key', value: '', is_secret: true },
          { key: 'domain', value: '', is_secret: false },
          { key: 'from_email', value: '', is_secret: false }
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