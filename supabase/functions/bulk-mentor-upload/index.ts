import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MentorData {
  email: string;
  full_name: string;
  github_username?: string;
  linkedin_profile_id?: string;
  institution_name?: string;
  bio?: string;
  avatar_url?: string;
  team_count?: number;
  tech_stacks?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (!roles?.length) {
      throw new Error('Unauthorized: Admin role required');
    }

    const { mentors } = await req.json();
    
    if (!Array.isArray(mentors)) {
      throw new Error('Invalid input: mentors must be an array');
    }

    // Create a job record
    const { data: job, error: jobError } = await supabase
      .from('bulk_upload_jobs')
      .insert({
        created_by: user.id,
        total_records: mentors.length,
        status: 'processing'
      })
      .select()
      .single();

    if (jobError) {
      throw new Error(`Failed to create job record: ${jobError.message}`);
    }

    // Process mentors in batches of 5
    const batchSize = 5;
    const errorLog: any[] = [];

    for (let i = 0; i < mentors.length; i += batchSize) {
      const batch = mentors.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}`);

      for (const mentor of batch) {
        try {
          const { data: result, error: createError } = await supabase
            .rpc('create_mentor', {
              mentor_email: mentor.email,
              mentor_full_name: mentor.full_name,
              mentor_github_username: mentor.github_username,
              mentor_linkedin_profile_id: mentor.linkedin_profile_id,
              mentor_institution_name: mentor.institution_name,
              mentor_bio: mentor.bio,
              mentor_avatar_url: mentor.avatar_url,
              mentor_team_count: mentor.team_count || 2,
              mentor_tech_stacks: mentor.tech_stacks || []
            });

          if (createError) {
            throw createError;
          }

          // Update job progress
          await supabase
            .from('bulk_upload_jobs')
            .update({
              processed_records: i + batch.indexOf(mentor) + 1,
              successful_records: supabase.sql`successful_records + 1`
            })
            .eq('id', job.id);

        } catch (error) {
          console.error(`Error processing mentor ${mentor.email}:`, error);
          errorLog.push({
            email: mentor.email,
            error: error.message
          });

          // Update job progress with failure
          await supabase
            .from('bulk_upload_jobs')
            .update({
              processed_records: i + batch.indexOf(mentor) + 1,
              failed_records: supabase.sql`failed_records + 1`,
              error_log: errorLog
            })
            .eq('id', job.id);
        }
      }

      // Add delay between batches to prevent timeouts
      if (i + batchSize < mentors.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update job status to completed
    await supabase
      .from('bulk_upload_jobs')
      .update({
        status: 'completed',
        error_log: errorLog
      })
      .eq('id', job.id);

    return new Response(
      JSON.stringify({
        jobId: job.id,
        totalProcessed: mentors.length,
        errors: errorLog
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in bulk-mentor-upload function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});