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
      // List invoices
      const url = new URL(req.url)
      const status = url.searchParams.get('status')
      const project_id = url.searchParams.get('project_id')

      let query = supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('contractor_id', userId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      if (project_id) {
        query = query.eq('project_id', project_id)
      }

      const { data: invoices, error } = await query

      if (error) {
        console.error('[invoices-crud] Error fetching invoices:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch invoices' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ invoices }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (req.method === 'POST') {
      // Create invoice
      const {
        client_name,
        client_email,
        client_address,
        project_id,
        items,
        tax_rate,
        discount_amount,
        payment_methods,
        payment_instructions,
        notes,
        terms,
        language,
        due_date,
      } = await req.json()

      if (!client_name || !items || !Array.isArray(items) || items.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Client name and items are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.unit_price)
      }, 0)

      const tax_amount = subtotal * (tax_rate || 0) / 100
      const total = subtotal + tax_amount - (discount_amount || 0)

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          contractor_id: userId,
          client_name,
          client_email,
          client_address,
          project_id,
          subtotal,
          tax_rate: tax_rate || 0,
          tax_amount,
          discount_amount: discount_amount || 0,
          total,
          payment_methods,
          payment_instructions,
          notes,
          terms,
          language: language || 'en-US',
          due_date,
          status: 'draft',
        })
        .select()
        .single()

      if (invoiceError) {
        console.error('[invoices-crud] Error creating invoice:', invoiceError)
        return new Response(
          JSON.stringify({ error: 'Failed to create invoice' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create invoice items
      const invoiceItems = items.map((item: any, index: number) => ({
        invoice_id: invoice.id,
        description: item.description,
        description_translated: item.description_translated,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        sort_order: index,
      }))

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems)

      if (itemsError) {
        console.error('[invoices-crud] Error creating invoice items:', itemsError)
        // Rollback invoice
        await supabase.from('invoices').delete().eq('id', invoice.id)
        return new Response(
          JSON.stringify({ error: 'Failed to create invoice items' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Fetch complete invoice with items
      const { data: completeInvoice } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('id', invoice.id)
        .single()

      return new Response(
        JSON.stringify({ invoice: completeInvoice }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (req.method === 'PUT') {
      // Update invoice
      const url = new URL(req.url)
      const invoiceId = url.searchParams.get('id')

      if (!invoiceId) {
        return new Response(
          JSON.stringify({ error: 'Invoice ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const updates = await req.json()

      const { data: invoice, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', invoiceId)
        .eq('contractor_id', userId)
        .select()
        .single()

      if (error) {
        console.error('[invoices-crud] Error updating invoice:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update invoice' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ invoice }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (req.method === 'DELETE') {
      // Delete invoice
      const url = new URL(req.url)
      const invoiceId = url.searchParams.get('id')

      if (!invoiceId) {
        return new Response(
          JSON.stringify({ error: 'Invoice ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId)
        .eq('contractor_id', userId)

      if (error) {
        console.error('[invoices-crud] Error deleting invoice:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to delete invoice' }),
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
    console.error('[invoices-crud] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})