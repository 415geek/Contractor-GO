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
    // Note: Webhooks don't require JWT authentication
    // They are called by external services (Telnyx)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    
    // Telnyx webhook payload structure
    const {
      data: {
        event_type,
        payload: {
          id,
          direction,
          from: { phone_number: fromNumber },
          to: [{ phone_number: toNumber }],
          text,
          type,
          media = [],
        },
      },
    } = body

    console.log('[sms-webhook] Received SMS:', {
      event_type,
      from: fromNumber,
      to: toNumber,
      text: text?.substring(0, 50),
    })

    // Only process inbound messages
    if (direction !== 'inbound') {
      return new Response(
        JSON.stringify({ message: 'Not an inbound message' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find virtual number
    const { data: virtualNumber, error: vnError } = await supabase
      .from('virtual_numbers')
      .select('*')
      .eq('phone_number', toNumber)
      .single()

    if (vnError || !virtualNumber) {
      console.error('[sms-webhook] Virtual number not found:', toNumber)
      return new Response(
        JSON.stringify({ error: 'Virtual number not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's language preference
    const { data: user } = await supabase
      .from('users')
      .select('primary_language')
      .eq('id', virtualNumber.user_id)
      .single()

    const targetLanguage = user?.primary_language || 'en-US'

    // TODO: Translate message using AI service
    // For now, we'll use the original text
    const translatedText = text
    const detectedLanguage = 'en-US'

    // Find or create conversation
    let conversation
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('*')
      .eq('virtual_number_id', virtualNumber.id)
      .eq('external_phone', fromNumber)
      .single()

    if (existingConv) {
      conversation = existingConv
      
      // Update unread count
      const unreadCounts = conversation.unread_counts || {}
      unreadCounts[virtualNumber.user_id] = (unreadCounts[virtualNumber.user_id] || 0) + 1
      
      await supabase
        .from('conversations')
        .update({
          last_message_preview: text,
          last_message_at: new Date().toISOString(),
          unread_counts,
        })
        .eq('id', conversation.id)
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          virtual_number_id: virtualNumber.id,
          participant_ids: [virtualNumber.user_id],
          type: 'sms',
          external_phone: fromNumber,
          external_name: fromNumber,
          last_message_preview: text,
          last_message_at: new Date().toISOString(),
          unread_counts: {
            [virtualNumber.user_id]: 1,
          },
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
        sender_id: null, // External sender
        type: media && media.length > 0 ? 'image' : 'text',
        content_original: text,
        content_translated: translatedText,
        original_language: detectedLanguage,
        target_language: targetLanguage,
        status: 'delivered',
        is_sms: true,
        sms_provider_message_id: id,
        media_url: media[0]?.url || null,
      })
      .select()
      .single()

    if (msgError) throw msgError

    // Update message count
    await supabase
      .from('virtual_numbers')
      .update({
        messages_received_this_month: virtualNumber.messages_received_this_month + 1,
      })
      .eq('id', virtualNumber.id)

    // TODO: Send push notification to user
    // This would integrate with a push notification service

    console.log('[sms-webhook] Message saved:', message.id)

    return new Response(
      JSON.stringify({ 
        message: 'SMS received and processed',
        message_id: message.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[sms-webhook] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})