import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { VoIPMSClient } from "../_shared/voipms/client.ts"

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

    const username = Deno.env.get('VOIPMS_USERNAME') ?? ''
    const apiPassword = Deno.env.get('VOIPMS_API_PASSWORD') ?? ''

    if (!username || !apiPassword) {
      return new Response(JSON.stringify({ error: 'Missing VoIP.ms credentials (VOIPMS_USERNAME / VOIPMS_API_PASSWORD)' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const state = url.searchParams.get('state') ?? undefined
    const areaCode = url.searchParams.get('areaCode') ?? undefined
    const ratecenter = url.searchParams.get('ratecenter') ?? undefined

    const client = new VoIPMSClient({ username, apiPassword })

    const numbers = await client.searchNumbers({
      state,
      areaCode,
      ratecenter,
      sms: true,
      limit: 25,
    })

    return new Response(JSON.stringify({ success: true, data: { numbers, total: numbers.length } }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[numbers-search] Error', error)
    return new Response(JSON.stringify({ error: (error as any)?.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
