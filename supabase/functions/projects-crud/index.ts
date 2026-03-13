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

    // Handle different HTTP methods
    if (req.method === 'GET') {
      // List projects
      const url = new URL(req.url)
      const status = url.searchParams.get('status')

      let query = supabase
        .from('projects')
        .select('*')
        .eq('contractor_id', userId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data: projects, error } = await query

      if (error) {
        console.error('[projects-crud] Error fetching projects:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch projects' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ projects }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (req.method === 'POST') {
      // Create project
      const {
        name,
        description,
        project_type,
        client_name,
        client_phone,
        client_email,
        client_language,
        address,
        location,
        estimated_start_date,
        estimated_end_date,
        estimated_budget_min,
        estimated_budget_max,
      } = await req.json()

      if (!name) {
        return new Response(
          JSON.stringify({ error: 'Project name is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          contractor_id: userId,
          name,
          description,
          project_type,
          client_name,
          client_phone,
          client_email,
          client_language: client_language || 'en-US',
          address,
          location,
          estimated_start_date,
          estimated_end_date,
          estimated_budget_min,
          estimated_budget_max,
          status: 'lead',
          progress_percentage: 0,
        })
        .select()
        .single()

      if (error) {
        console.error('[projects-crud] Error creating project:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to create project' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ project }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (req.method === 'PUT') {
      // Update project
      const url = new URL(req.url)
      const projectId = url.searchParams.get('id')

      if (!projectId) {
        return new Response(
          JSON.stringify({ error: 'Project ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const updates = await req.json()

      const { data: project, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('contractor_id', userId)
        .select()
        .single()

      if (error) {
        console.error('[projects-crud] Error updating project:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update project' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ project }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (req.method === 'DELETE') {
      // Delete project
      const url = new URL(req.url)
      const projectId = url.searchParams.get('id')

      if (!projectId) {
        return new Response(
          JSON.stringify({ error: 'Project ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('contractor_id', userId)

      if (error) {
        console.error('[projects-crud] Error deleting project:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to delete project' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[projects-crud] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})