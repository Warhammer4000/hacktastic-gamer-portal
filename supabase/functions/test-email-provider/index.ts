import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestEmailRequest {
  type: 'resend' | 'sendgrid' | 'smtp';
  settings: Record<string, string | null>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, settings } = await req.json() as TestEmailRequest;

    switch (type) {
      case 'resend': {
        const apiKey = settings['api_key'];
        if (!apiKey) throw new Error('API key is required');

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'test@resend.dev',
            to: 'test@resend.dev',
            subject: 'Test Connection',
            text: 'This is a test connection.',
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Resend API error: ${error}`);
        }
        break;
      }

      case 'sendgrid': {
        const apiKey = settings['api_key'];
        if (!apiKey) throw new Error('API key is required');

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: 'test@example.com' }] }],
            from: { email: 'test@example.com' },
            subject: 'Test Connection',
            content: [{ type: 'text/plain', value: 'This is a test connection.' }],
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`SendGrid API error: ${error}`);
        }
        break;
      }

      case 'smtp': {
        // For SMTP, we'll just validate that required fields are present
        const required = ['host', 'port', 'username', 'password'];
        const missing = required.filter(field => !settings[field]);
        
        if (missing.length > 0) {
          throw new Error(`Missing required SMTP fields: ${missing.join(', ')}`);
        }
        break;
      }

      default:
        throw new Error(`Unsupported email provider type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
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
      },
    )
  }
})