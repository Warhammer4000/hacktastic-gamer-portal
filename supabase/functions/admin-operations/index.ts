import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { operation, data } = await req.json()

    switch (operation) {
      case 'deleteUser': {
        const { userId } = data
        console.log('Deleting user:', userId)

        // Call the delete_user_cascade function
        const { data: result, error } = await supabase.rpc('delete_user_cascade', {
          input_user_id: userId
        })

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, message: 'User deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Add other admin operations here as needed

      default:
        throw new Error('Invalid operation')
    }
  } catch (error) {
    console.error('Error in admin-operations function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})