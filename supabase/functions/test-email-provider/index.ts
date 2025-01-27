import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  type: 'resend' | 'sendgrid' | 'smtp' | 'mailgun';
  settings: Record<string, string | null>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, settings } = await req.json() as TestEmailRequest;

    switch (type) {
      case 'smtp': {
        const client = new SMTPClient({
          connection: {
            hostname: settings.host as string,
            port: parseInt(settings.port as string),
            tls: settings.secure === 'true',
            auth: {
              username: settings.username as string,
              password: settings.password as string,
            },
          },
        });

        try {
          await client.connect();
          await client.close();
          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          throw new Error(`SMTP connection failed: ${error.message}`);
        }
      }

      case 'sendgrid': {
        const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.api_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ 
              to: [{ email: settings.from_email || 'test@example.com' }] 
            }],
            from: { email: settings.from_email || 'test@example.com' },
            subject: 'Test Connection',
            content: [{ type: 'text/plain', value: 'This is a test connection.' }],
          }),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(`SendGrid API error: ${error}`);
        }
        break;
      }

      case 'mailgun': {
        const domain = settings.domain;
        const apiKey = settings.api_key;
        const fromEmail = settings.from_email || `test@${domain}`;
        
        console.log('Testing Mailgun connection with:', {
          domain,
          fromEmail,
          hasApiKey: !!apiKey
        });
        
        const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`api:${apiKey}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            from: fromEmail,
            to: fromEmail,
            subject: 'Test Connection',
            text: 'This is a test connection.',
          }),
        });

        if (!res.ok) {
          const error = await res.text();
          console.error('Mailgun API error:', error);
          throw new Error(`Mailgun API error: ${error}`);
        }
        
        console.log('Mailgun test successful');
        break;
      }

      case 'resend': {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.api_key}`,
          },
          body: JSON.stringify({
            from: settings.from_email ? `${settings.from_name} <${settings.from_email}>` : 'test@resend.dev',
            to: ['test@resend.dev'],
            subject: 'Test Connection',
            text: 'This is a test connection.',
          }),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Resend API error: ${error}`);
        }
        break;
      }

      default:
        throw new Error(`Unsupported email provider type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error testing email provider:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});