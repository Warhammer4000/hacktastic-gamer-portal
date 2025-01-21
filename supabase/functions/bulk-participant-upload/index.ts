import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ParticipantData {
  email: string;
  full_name: string;
  github_username?: string;
  institution_name?: string;
  bio?: string;
  avatar_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Starting bulk participant upload process");

    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the request body
    const { participants, jobId } = await req.json()
    console.log("Received request:", {
      jobId,
      participantCount: participants.length,
      firstParticipant: participants[0]
    });

    if (!Array.isArray(participants) || !jobId) {
      console.error("Invalid request format:", { participants, jobId });
      throw new Error('Invalid request format')
    }

    // Update job status to processing
    await supabaseAdmin
      .from('bulk_upload_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId)

    console.log(`Starting bulk upload for job ${jobId} with ${participants.length} participants`)

    const results = []
    let successCount = 0
    let failureCount = 0

    for (const participant of participants) {
      try {
        console.log(`Processing participant: ${participant.email}`);

        // Create auth user with random password
        const password = Math.random().toString(36).slice(-12)
        console.log("Generated password for user");

        const createUserPayload = {
          email: participant.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: participant.full_name
          }
        };
        console.log("Creating user with payload:", createUserPayload);

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser(createUserPayload);

        if (authError) {
          console.error(`Auth error for ${participant.email}:`, authError);
          throw authError;
        }
        console.log(`Created user for ${participant.email} with ID: ${authData.user.id}`);

        // Look up institution if provided
        let institutionId = null;
        if (participant.institution_name) {
          console.log(`Looking up institution: ${participant.institution_name}`);
          const { data: institution } = await supabaseAdmin
            .from('institutions')
            .select('id')
            .eq('name', participant.institution_name)
            .single();
          
          institutionId = institution?.id;
          console.log(`Found institution ID: ${institutionId} for ${participant.institution_name}`);
        }

        // Update profile with additional information
        const profileData = {
          github_username: participant.github_username,
          institution_id: institutionId,
          bio: participant.bio,
          avatar_url: participant.avatar_url,
          status: participant.github_username ? 'approved' : 'incomplete'
        };
        console.log(`Updating profile for ${participant.email}:`, profileData);

        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update(profileData)
          .eq('id', authData.user.id);

        if (profileError) {
          console.error(`Profile error for ${participant.email}:`, profileError);
          throw profileError;
        }

        // Add participant role
        console.log(`Adding participant role for ${participant.email}`);
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert([{ user_id: authData.user.id, role: 'participant' }]);

        if (roleError) {
          console.error(`Role error for ${participant.email}:`, roleError);
          throw roleError;
        }

        successCount++;
        results.push({
          email: participant.email,
          success: true,
          details: { userId: authData.user.id }
        });
        console.log(`Successfully processed ${participant.email}`);

      } catch (error) {
        console.error(`Error processing participant ${participant.email}:`, error);
        failureCount++;
        results.push({
          email: participant.email,
          success: false,
          error: error.message
        });
      }

      // Update job progress
      await supabaseAdmin
        .from('bulk_upload_jobs')
        .update({
          processed_records: successCount + failureCount,
          successful_records: successCount,
          failed_records: failureCount,
          error_log: results.filter(r => !r.success)
        })
        .eq('id', jobId);
    }

    // Update job as completed
    console.log(`Completing job ${jobId}. Success: ${successCount}, Failed: ${failureCount}`);
    await supabaseAdmin
      .from('bulk_upload_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_records: participants.length,
        successful_records: successCount,
        failed_records: failureCount,
        error_log: results.filter(r => !r.success)
      })
      .eq('id', jobId);

    console.log(`Job ${jobId} completed. Success: ${successCount}, Failed: ${failureCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        summary: {
          total: participants.length,
          successful: successCount,
          failed: failureCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})