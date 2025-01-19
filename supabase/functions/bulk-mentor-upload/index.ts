import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    return new Response(null, { headers: corsHeaders })
  }

  try {
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
    const { mentors, jobId } = await req.json()

    if (!Array.isArray(mentors) || !jobId) {
      throw new Error('Invalid request format')
    }

    // Update job status to processing
    await supabaseAdmin
      .from('bulk_upload_jobs')
      .update({ status: 'processing' })
      .eq('id', jobId)

    console.log(`Starting bulk upload for job ${jobId} with ${mentors.length} mentors`)

    const results = []
    let successCount = 0
    let failureCount = 0

    for (const mentor of mentors) {
      try {
        console.log(`Processing mentor: ${mentor.email}`)

        // Create auth user with random password
        const password = Math.random().toString(36).slice(-12)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: mentor.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: mentor.full_name
          }
        })

        if (authError) throw authError
        console.log(`Created user for ${mentor.email} with ID: ${authData.user.id}`)

        // Look up institution if provided
        let institutionId = null
        if (mentor.institution_name) {
          const { data: institution } = await supabaseAdmin
            .from('institutions')
            .select('id')
            .eq('name', mentor.institution_name)
            .single()
          
          institutionId = institution?.id
          console.log(`Found institution ID: ${institutionId} for ${mentor.institution_name}`)
        }

        // Call setup_mentor_data function
        const { data: setupData, error: setupError } = await supabaseAdmin.rpc(
          'setup_mentor_data',
          {
            mentor_id: authData.user.id,
            mentor_github_username: mentor.github_username,
            mentor_linkedin_profile_id: mentor.linkedin_profile_id,
            mentor_institution_id: institutionId,
            mentor_bio: mentor.bio,
            mentor_avatar_url: mentor.avatar_url,
            mentor_team_count: mentor.team_count || 2,
            mentor_tech_stacks: mentor.tech_stacks || []
          }
        )

        if (setupError) {
          console.error(`Setup error for ${mentor.email}:`, setupError)
          throw setupError
        }

        console.log(`Setup completed for ${mentor.email}:`, setupData)

        successCount++
        results.push({
          email: mentor.email,
          success: true,
          details: setupData
        })

      } catch (error) {
        console.error(`Error processing mentor ${mentor.email}:`, error)
        failureCount++
        results.push({
          email: mentor.email,
          success: false,
          error: error.message
        })
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
        .eq('id', jobId)
    }

    // Update job as completed
    await supabaseAdmin
      .from('bulk_upload_jobs')
      .update({
        status: 'completed',
        processed_records: mentors.length,
        successful_records: successCount,
        failed_records: failureCount,
        error_log: results.filter(r => !r.success)
      })
      .eq('id', jobId)

    console.log(`Job ${jobId} completed. Success: ${successCount}, Failed: ${failureCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        results,
        summary: {
          total: mentors.length,
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
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})