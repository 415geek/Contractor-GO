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
    const { phone, email, password } = await req.json()

    // Validate required fields
    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!phone && !email) {
      return new Response(
        JSON.stringify({ error: 'Phone or email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(`phone.eq.${phone},email.eq.${email}`)
      .single()

    if (userError || !userData) {
      console.error('[auth-login] User not found:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is active
    if (userData.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Account is not active' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.password_hash)
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userData.id)

    // Create JWT token
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
          avatar_url: userData.avatar_url,
          company_name: userData.company_name,
        },
        token,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[auth-login] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})