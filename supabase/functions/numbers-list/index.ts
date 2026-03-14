import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { verifyClerkAuthHeader } from "../_shared/clerk/verify.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const claims = await verifyClerkAuthHeader(req.headers.get('Authorization'))
    const clerkUserId = claims.sub

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: identity, error: identityErr } = await supabase
      .from('clerk_users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .maybeSingle()

    if (identityErr) {
      throw identityErr
    }

    if (!identity) {
      return new Response(JSON.stringify({ success: true, data: { virtual_numbers: [] } }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: numbers, error: numbersErr } = await supabase
      .from('virtual_numbers')
      .select('*')
      .eq('user_id', identity.id)
      .order('created_at', { ascending: false })

    if (numbersErr) {
      throw numbersErr
    }

    return new Response(JSON.stringify({ success: true, data: { virtual_numbers: numbers ?? [] } }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[numbers-list] Error', error)
    return new Response(JSON.stringify({ error: (error as any)?.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
