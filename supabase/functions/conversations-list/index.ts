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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get conversations where user is a participant
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('participant_ids', [userId])
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (error) {
      console.error('[conversations-list] Error fetching conversations:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch conversations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get participant info for each conversation
    const conversationsWithParticipants = await Promise.all(
      (conversations || []).map(async (conv) => {
        // Get other participants
        const otherParticipantIds = conv.participant_ids.filter((id: string) => id !== userId)
        
        const { data: participants } = await supabase
          .from('users')
          .select('id, display_name, avatar_url')
          .in('id', otherParticipantIds)

        // Get unread count for this user
        const unreadCount = (conv.unread_counts as any)?.[userId] || 0

        return {
          ...conv,
          participants: participants || [],
          unread_count: unreadCount,
        }
      })
    )

    return new Response(
      JSON.stringify({
        conversations: conversationsWithParticipants,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[conversations-list] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})