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
          description: 'Configure your SMTP settings using your email service provider credentials.'
        };
      default:
        return { description: '' };
    }
  };

  return {
    getProviderIcon,
    getProviderGuide
  };
}