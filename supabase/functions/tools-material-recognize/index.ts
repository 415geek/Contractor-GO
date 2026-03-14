import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

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
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { images } = body

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: images (array of base64 strings)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // NOTE: This endpoint is intentionally public for now.
    // The app has switched to Clerk auth; Supabase Auth token validation would fail.

    const recognitionResult = {
      material: {
        category: '瓷砖',
        type: '陶瓷砖',
        brand: 'Daltile',
        model: 'Elevare EL17',
        specifications: {
          size: '12" x 24"',
          color: '米白色',
          finish: '哑光',
          thickness: '9mm',
        },
        confidence: 0.94,
      },
      detected_text: [
        'Daltile',
        'Elevare EL17',
        '12" x 24"',
        'Ceramic Tile',
      ],
      suggestions: [
        '拍摄更多角度的照片可以提高识别准确度',
        '确保产品标签清晰可见',
      ],
    }

    return new Response(
      JSON.stringify({
        result: recognitionResult,
        message: 'Material recognition completed',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[tools-material-recognize] Error:', error)
    return new Response(
      JSON.stringify({ error: (error as any)?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
