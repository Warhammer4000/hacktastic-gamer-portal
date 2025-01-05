import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GitHubSettings {
  organization_name: string;
  participant_team_slug: string;
  mentor_team_slug: string;
  personal_access_token: string;
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

    // Get GitHub settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('github_settings')
      .select('*')
      .single()

    if (settingsError || !settings) {
      throw new Error('GitHub settings not found')
    }

    // Get team details including members
    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .select(`
        id,
        name,
        description,
        mentor_id,
        team_members!inner (
          user_id,
          profile:profiles!inner (
            github_username
          )
        )
      `)
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      throw new Error('Team not found')
    }

    // Get mentor's GitHub username
    const { data: mentorProfile } = await supabaseClient
      .from('profiles')
      .select('github_username')
      .eq('id', team.mentor_id)
      .single()

    // Create repository name (lowercase, replace spaces with hyphens)
    const repoName = `team-${team.name.toLowerCase().replace(/\s+/g, '-')}`

    // Create repository in GitHub
    const createRepoResponse = await fetch(
      `https://api.github.com/orgs/${settings.organization_name}/repos`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${settings.personal_access_token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify({
          name: repoName,
          description: team.description,
          private: true,
          has_issues: true,
          has_projects: true,
          has_wiki: true
        })
      }
    )

    if (!createRepoResponse.ok) {
      throw new Error('Failed to create repository')
    }

    const repo = await createRepoResponse.json()

    // Add team members to repository
    const memberUsernames = team.team_members
      .map(member => member.profile.github_username)
      .filter(Boolean)

    if (mentorProfile?.github_username) {
      memberUsernames.push(mentorProfile.github_username)
    }

    // Add collaborators
    await Promise.all(
      memberUsernames.map(username =>
        fetch(
          `https://api.github.com/repos/${settings.organization_name}/${repoName}/collaborators/${username}`,
          {
            method: 'PUT',
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': `Bearer ${settings.personal_access_token}`,
              'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify({
              permission: 'push'
            })
          }
        )
      )
    )

    // Update team with repository URL
    await supabaseClient
      .from('teams')
      .update({
        repository_url: repo.html_url
      })
      .eq('id', teamId)

    return new Response(
      JSON.stringify({ repository_url: repo.html_url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})