import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { VoIPMSClient } from "../_shared/voipms/client.ts"
import { verifyClerkAuthHeader } from "../_shared/clerk/verify.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function randomBase32(len: number) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567'
  let out = ''
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return out
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const claims = await verifyClerkAuthHeader(req.headers.get('Authorization'))
    const clerkUserId = claims.sub

    const username = Deno.env.get('VOIPMS_USERNAME') ?? ''
    const apiPassword = Deno.env.get('VOIPMS_API_PASSWORD') ?? ''
    const defaultPackage = Deno.env.get('VOIPMS_DEFAULT_PACKAGE') ?? ''
    const appUrl = Deno.env.get('APP_URL') ?? ''

    if (!username || !apiPassword) {
      return new Response(JSON.stringify({ error: 'Missing VoIP.ms credentials (VOIPMS_USERNAME / VOIPMS_API_PASSWORD)' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const did = body?.did as string | undefined
    const planType = body?.planType as 'BASIC' | 'PRO' | 'BUSINESS' | undefined
    const email = body?.email as string | undefined

    if (!did) {
      return new Response(JSON.stringify({ error: 'Missing required field: did' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const packageName = body?.packageName as string | undefined
    const resolvedPackage = packageName || defaultPackage || (planType ? `ContractorLink_${planType}` : undefined)

    const client = new VoIPMSClient({ username, apiPassword })

    const subUsername = `cl_${randomBase32(8)}`
    const subPassword = `${randomBase32(14)}${Math.floor(Math.random() * 10)}`

    const sub = await client.createSubAccount({
      username: subUsername,
      password: subPassword,
      email,
      packageName: resolvedPackage,
    })

    const purchase = await client.purchaseNumber({
      did,
      subAccountId: sub.account,
      billingType: 'perminute',
    })

    if (appUrl) {
      try {
        await client.setSMSWebhook({
          did: purchase.did,
          url: `${appUrl.replace(/\/$/, '')}/webhooks/voipms/sms`,
        })
      } catch (e) {
        console.warn('[numbers-purchase] setSMSWebhook failed', e)
      }
    }

    // Persist to DB using service role (bypass RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: identity, error: upsertErr } = await supabase
      .from('clerk_users')
      .upsert({ clerk_user_id: clerkUserId }, { onConflict: 'clerk_user_id' })
      .select('id')
      .single()

    if (upsertErr) {
      throw upsertErr
    }

    const areaDigits = purchase.did.replace(/\D/g, '').replace(/^1/, '').slice(0, 3)

    const plan = planType === 'BASIC' ? 'basic' : 'professional'

    const { data: vn, error: insertErr } = await supabase
      .from('virtual_numbers')
      .insert({
        user_id: identity.id,
        phone_number: purchase.did,
        area_code: areaDigits,
        country_code: '+1',
        provider: 'voipms',
        provider_number_id: purchase.orderId ?? null,
        plan_type: plan,
        status: 'active',
        monthly_cost: purchase.monthlyFee ?? (planType === 'BASIC' ? 5.99 : 14.99),
        next_billing_date: addMonths(new Date(), 1).toISOString().slice(0, 10),
      })
      .select('*')
      .single()

    if (insertErr) {
      throw insertErr
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          subAccount: sub,
          purchase,
          packageName: resolvedPackage,
          virtualNumber: vn,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('[numbers-purchase] Error', error)
    const msg = (error as any)?.message || 'Internal server error'
    const status = msg === 'Unauthorized' ? 401 : 500
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})