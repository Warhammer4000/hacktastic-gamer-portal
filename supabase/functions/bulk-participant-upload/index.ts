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

    if (!Array.isArray(participants) || !jobId) {
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
        console.log(`Processing participant: ${participant.email}`)

        // Create auth user with random password
        const password = Math.random().toString(36).slice(-12)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: participant.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: participant.full_name
          }
        })

        if (authError) throw authError
        console.log(`Created user for ${participant.email} with ID: ${authData.user.id}`)

        // Look up institution if provided
        let institutionId = null
        if (participant.institution_name) {
          const { data: institution } = await supabaseAdmin
            .from('institutions')
            .select('id')
            .eq('name', participant.institution_name)
            .single()
          
          institutionId = institution?.id
          console.log(`Found institution ID: ${institutionId} for ${participant.institution_name}`)
        }

        // Update profile with additional information
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            github_username: participant.github_username,
            institution_id: institutionId,
            bio: participant.bio,
            avatar_url: participant.avatar_url,
            status: participant.github_username ? 'approved' : 'incomplete'
          })
          .eq('id', authData.user.id)

        if (profileError) throw profileError

        // Add participant role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert([{ user_id: authData.user.id, role: 'participant' }])

        if (roleError) throw roleError

        successCount++
        results.push({
          email: participant.email,
          success: true,
          details: { userId: authData.user.id }
        })

      } catch (error) {
        console.error(`Error processing participant ${participant.email}:`, error)
        failureCount++
        results.push({
          email: participant.email,
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
        completed_at: new Date().toISOString(),
        processed_records: participants.length,
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