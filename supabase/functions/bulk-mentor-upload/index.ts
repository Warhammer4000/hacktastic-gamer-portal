import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mentors } = await req.json();
    
    if (!Array.isArray(mentors)) {
      throw new Error('Invalid input: mentors must be an array');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process mentors in batches of 5
    const batchSize = 5;
    const results = [];

    for (let i = 0; i < mentors.length; i += batchSize) {
      const batch = mentors.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}`);

      for (const mentor of batch) {
        try {
          // First, look up the institution ID if an institution name is provided
          let institutionId = null;
          if (mentor.institution_name) {
            const { data: institution, error: institutionError } = await supabase
              .from('institutions')
              .select('id')
              .eq('name', mentor.institution_name)
              .eq('status', 'active')
              .single();

            if (institutionError) {
              console.error(`Error finding institution "${mentor.institution_name}":`, institutionError);
            } else {
              institutionId = institution?.id;
            }
          }

          // Call create_mentor with the correct parameters
          const { data: result, error: createError } = await supabase.rpc(
            'create_mentor',
            {
              mentor_email: mentor.email,
              mentor_full_name: mentor.full_name,
              mentor_github_username: mentor.github_username || null,
              mentor_linkedin_profile_id: mentor.linkedin_profile_id || null,
              mentor_institution_id: institutionId,
              mentor_bio: mentor.bio || null,
              mentor_avatar_url: mentor.avatar_url || null,
              mentor_team_count: mentor.team_count || 2,
              mentor_tech_stacks: mentor.tech_stacks || []
            }
          );

          if (createError) {
            throw createError;
          }

          results.push({
            email: mentor.email,
            success: true,
            result
          });

        } catch (error) {
          console.error(`Error processing mentor ${mentor.email}:`, error);
          results.push({
            email: mentor.email,
            success: false,
            error: error.message
          });
        }
      }

      // Add delay between batches to prevent timeouts
      if (i + batchSize < mentors.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        message: `Processed ${mentors.length} mentors: ${successful} successful, ${failed} failed`,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in bulk-mentor-upload function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});