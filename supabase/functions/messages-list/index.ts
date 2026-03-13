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

    // Verify token
    const token = authHeader.replace('Bearer ', '')
    let userId: string
    try {
      const decoded = JSON.parse(atob(token))
      userId = decoded.user_id
      
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

    const url = new URL(req.url)
    const conversation_id = url.searchParams.get('conversation_id')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const before = url.searchParams.get('before')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (conversation_id) {
      query = query.eq('conversation_id', conversation_id)
    } else {
      // Get all conversations user is part of
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .contains('participant_ids', [userId])

      const conversationIds = conversations?.map(c => c.id) || []
      if (conversationIds.length > 0) {
        query = query.in('conversation_id', conversationIds)
      } else {
        return new Response(
          JSON.stringify({ messages: [] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (before) {
      query = query.lt('created_at', before)
    }

    const { data: messages, error } = await query

    if (error) {
      console.error('[messages-list] Error fetching messages:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch messages' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get sender info for each message
    const messagesWithSenders = await Promise.all(
      (messages || []).map(async (msg) => {
        if (!msg.sender_id) return msg
        
        const { data: sender } = await supabase
          .from('users')
          .select('id, display_name, avatar_url')
          .eq('id', msg.sender_id)
          .single()

        return {
          ...msg,
          sender: sender || null,
        }
      })
    )

    return new Response(
      JSON.stringify({
        messages: messagesWithSenders.reverse(), // Return in chronological order
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[messages-list] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})