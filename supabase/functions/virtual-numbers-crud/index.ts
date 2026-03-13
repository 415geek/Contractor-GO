import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const method = req.method

    // GET - List virtual numbers
    if (method === 'GET') {
      const { data: numbers, error } = await supabase
        .from('virtual_numbers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ virtual_numbers: numbers }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST - Create virtual number
    if (method === 'POST') {
      const body = await req.json()
      const { phone_number, area_code, plan_type, provider_number_id } = body

      if (!phone_number || !plan_type) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: phone_number, plan_type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Determine monthly cost based on plan
      const monthlyCost = plan_type === 'professional' ? 15 : 5

      // Calculate next billing date (30 days from now)
      const nextBillingDate = new Date()
      nextBillingDate.setDate(nextBillingDate.getDate() + 30)

      const { data: number, error } = await supabase
        .from('virtual_numbers')
        .insert({
          user_id: user.id,
          phone_number,
          area_code: area_code || phone_number.substring(1, 4),
          country_code: '+1',
          provider: 'telnyx',
          provider_number_id: provider_number_id || null,
          plan_type,
          status: 'active',
          monthly_cost: monthlyCost,
          next_billing_date: nextBillingDate.toISOString().split('T')[0],
          messages_sent_this_month: 0,
          messages_received_this_month: 0,
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ virtual_number: number }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT - Update virtual number
    if (method === 'PUT') {
      const id = url.searchParams.get('id')
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing id parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const body = await req.json()
      const { status, auto_renew, plan_type } = body

      // Verify ownership
      const { data: existing } = await supabase
        .from('virtual_numbers')
        .select('user_id')
        .eq('id', id)
        .single()

      if (!existing || existing.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Virtual number not found or access denied' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const updateData: any = {}
      if (status) updateData.status = status
      if (auto_renew !== undefined) updateData.auto_renew = auto_renew
      if (plan_type) {
        updateData.plan_type = plan_type
        updateData.monthly_cost = plan_type === 'professional' ? 15 : 5
      }

      const { data: number, error } = await supabase
        .from('virtual_numbers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ virtual_number: number }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // DELETE - Delete virtual number
    if (method === 'DELETE') {
      const id = url.searchParams.get('id')
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing id parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify ownership
      const { data: existing } = await supabase
        .from('virtual_numbers')
        .select('user_id')
        .eq('id', id)
        .single()

      if (!existing || existing.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Virtual number not found or access denied' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error } = await supabase
        .from('virtual_numbers')
        .delete()
        .eq('id', id)

      if (error) throw error

      return new Response(
        JSON.stringify({ message: 'Virtual number deleted successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[virtual-numbers-crud] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})