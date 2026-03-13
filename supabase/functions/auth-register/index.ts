import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { bcrypt } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

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
    const { phone, email, password, role, display_name, primary_language, interface_language } = await req.json()

    // Validate required fields
    if (!password || !role) {
      return new Response(
        JSON.stringify({ error: 'Password and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!phone && !email) {
      return new Response(
        JSON.stringify({ error: 'Phone or email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate role
    if (!['contractor', 'client'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Create user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        phone,
        email,
        password_hash,
        role,
        display_name: display_name || phone || email,
        primary_language: primary_language || 'zh-CN',
        interface_language: interface_language || 'zh-CN',
      })
      .select()
      .single()

    if (userError) {
      console.error('[auth-register] Error creating user:', userError)
      return new Response(
        JSON.stringify({ error: 'Failed to create user', details: userError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create JWT token (simplified - in production use proper JWT library)
    const token = btoa(JSON.stringify({
      user_id: userData.id,
      role: userData.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }))

    return new Response(
      JSON.stringify({
        user: {
          id: userData.id,
          phone: userData.phone,
          email: userData.email,
          role: userData.role,
          display_name: userData.display_name,
          primary_language: userData.primary_language,
          interface_language: userData.interface_language,
        },
        token,
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[auth-register] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})