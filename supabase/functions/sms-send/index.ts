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

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { virtual_number_id, to, text, media_urls } = body

    if (!virtual_number_id || !to || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: virtual_number_id, to, text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get virtual number
    const { data: virtualNumber, error: vnError } = await supabase
      .from('virtual_numbers')
      .select('*')
      .eq('id', virtual_number_id)
      .eq('user_id', user.id)
      .single()

    if (vnError || !virtualNumber) {
      return new Response(
        JSON.stringify({ error: 'Virtual number not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (virtualNumber.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Virtual number is not active' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check message limit for basic plan
    if (virtualNumber.plan_type === 'basic') {
      const { data: settings } = await supabase
        .from('virtual_numbers')
        .select('messages_sent_this_month')
        .eq('id', virtual_number_id)
        .single()

      if (settings && settings.messages_sent_this_month >= 100) {
        return new Response(
          JSON.stringify({ error: 'Monthly message limit reached for basic plan' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // TODO: Integrate with Telnyx API to send SMS
    // For now, we'll simulate the send
    const smsResult = {
      id: `sms_${Date.now()}`,
      status: 'sent',
      direction: 'outbound',
      from: virtualNumber.phone_number,
      to: to,
      text: text,
      media_urls: media_urls || [],
      created_at: new Date().toISOString(),
    }

    // Update message count
    await supabase
      .from('virtual_numbers')
      .update({
        messages_sent_this_month: virtualNumber.messages_sent_this_month + 1,
      })
      .eq('id', virtual_number_id)

    // Find or create conversation
    let conversation
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('*')
      .eq('virtual_number_id', virtual_number_id)
      .eq('external_phone', to)
      .single()

    if (existingConv) {
      conversation = existingConv
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          virtual_number_id,
          participant_ids: [user.id],
          type: 'sms',
          external_phone: to,
          external_name: to,
          last_message_preview: text,
          last_message_at: new Date().toISOString(),
          unread_counts: {},
        })
        .select()
        .single()

      conversation = newConv
    }

    // Create message record
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        type: media_urls && media_urls.length > 0 ? 'image' : 'text',
        content_original: text,
        content_translated: text,
        original_language: 'en-US',
        target_language: 'en-US',
        status: 'sent',
        is_sms: true,
        sms_provider_message_id: smsResult.id,
        media_url: media_urls?.[0] || null,
      })
      .select()
      .single()

    if (msgError) throw msgError

    // Update conversation
    await supabase
      .from('conversations')
      .update({
        last_message_preview: text,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversation.id)

    return new Response(
      JSON.stringify({ 
        message,
        sms_result: smsResult,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[sms-send] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})