import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { teamId } = await req.json()

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get GitHub settings and team details
    const { data: settings, error: settingsError } = await supabaseClient
      .from('github_settings')
      .select('*')
      .single()

    if (settingsError || !settings) {
      throw new Error('GitHub settings not found')
    }

    // Get team repository URL
    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .select('repository_url')
      .eq('id', teamId)
      .single()

    if (teamError || !team?.repository_url) {
      throw new Error('Team or repository URL not found')
    }

    // Extract repository name from URL
    const repoName = team.repository_url.split('/').pop()
    if (!repoName) {
      throw new Error('Invalid repository URL')
    }

    // Delete repository in GitHub
    const deleteRepoResponse = await fetch(
      `https://api.github.com/repos/${settings.organization_name}/${repoName}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${settings.personal_access_token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    if (!deleteRepoResponse.ok && deleteRepoResponse.status !== 404) {
      const error = await deleteRepoResponse.text()
      console.error('GitHub API Error:', error)
      throw new Error('Failed to delete GitHub repository')
    }

    return new Response(
      JSON.stringify({ success: true }),
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