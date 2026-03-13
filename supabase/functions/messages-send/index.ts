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
    // Get auth token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify token (simplified)
    const token = authHeader.replace('Bearer ', '')
    let userId: string
    try {
      const decoded = JSON.parse(atob(token))
      userId = decoded.user_id
      
      // Check token expiration
      if (decoded.exp < Date.now()) {
        return new Response(
          JSON.stringify({ error: 'Token expired' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { conversation_id, content, type = 'text', target_language } = await req.json()

    // Validate required fields
    if (!conversation_id || !content) {
      return new Response(
        JSON.stringify({ error: 'conversation_id and content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get conversation and verify user is participant
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversation_id)
      .single()

    if (convError || !conversation) {
      return new Response(
        JSON.stringify({ error: 'Conversation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!conversation.participant_ids.includes(userId)) {
      return new Response(
        JSON.stringify({ error: 'Not a participant in this conversation' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get sender's language
    const { data: sender } = await supabase
      .from('users')
      .select('primary_language')
      .eq('id', userId)
      .single()

    const original_language = sender?.primary_language || 'zh-CN'

    // Get recipient's language (first other participant)
    const recipientId = conversation.participant_ids.find((id: string) => id !== userId)
    let targetLang = target_language
    
    if (!targetLang && recipientId) {
      const { data: recipient } = await supabase
        .from('users')
        .select('primary_language')
        .eq('id', recipientId)
        .single()
      targetLang = recipient?.primary_language || 'en-US'
    }

    // Translate message (simplified - in production use actual translation API)
    let translatedContent = content
    if (targetLang && targetLang !== original_language) {
      // TODO: Integrate with Claude API for translation
      translatedContent = await translateMessage(content, original_language, targetLang)
    }

    // Create message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id,
        sender_id: userId,
        type,
        content_original: content,
        content_translated: translatedContent,
        original_language,
        target_language: targetLang,
        status: 'sent',
      })
      .select()
      .single()

    if (msgError) {
      console.error('[messages-send] Error creating message:', msgError)
      return new Response(
        JSON.stringify({ error: 'Failed to send message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update conversation
    await supabase
      .from('conversations')
      .update({
        last_message_preview: content,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversation_id)

    // Update unread count for recipient
    if (recipientId) {
      const { data: conv } = await supabase
        .from('conversations')
        .select('unread_counts')
        .eq('id', conversation_id)
        .single()

      const unreadCounts = conv?.unread_counts || {}
      unreadCounts[recipientId] = (unreadCounts[recipientId] || 0) + 1

      await supabase
        .from('conversations')
        .update({ unread_counts })
        .eq('id', conversation_id)
    }

    return new Response(
      JSON.stringify({
        message: {
          id: message.id,
          conversation_id: message.conversation_id,
          sender_id: message.sender_id,
          type: message.type,
          content_original: message.content_original,
          content_translated: message.content_translated,
          original_language: message.original_language,
          target_language: message.target_language,
          status: message.status,
          created_at: message.created_at,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[messages-send] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Simplified translation function (replace with actual API call)
async function translateMessage(text: string, fromLang: string, toLang: string): Promise<string> {
  // TODO: Integrate with Claude API for actual translation
  // For now, return a placeholder
  return `[Translated from ${fromLang} to ${toLang}]: ${text}`
}