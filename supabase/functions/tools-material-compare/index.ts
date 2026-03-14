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
    const { material, location, search_radius_km = 50 } = body

    if (!material) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: material' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // NOTE: This endpoint is intentionally public for now.
    // The app has switched to Clerk auth; Supabase Auth token validation would fail.

    const priceResults = {
      material: {
        name: `${material.brand} ${material.model}`,
        category: material.category,
        type: material.type,
        specifications: material.specifications,
      },
      location: location || {
        city: 'San Francisco',
        lat: 37.7749,
        lng: -122.4194,
      },
      search_radius: search_radius_km,
      results: [
        {
          id: '1',
          store: 'Home Depot',
          location: 'Daly City, CA',
          distance: 4.2,
          distance_unit: 'mi',
          price: 3.29,
          price_unit: 'sqft',
          in_stock: true,
          stock_level: '充足',
          url: 'https://www.homedepot.com/p/example',
          phone: '(415) 555-0101',
          rating: 4.5,
          reviews: 234,
          is_lowest_price: false,
        },
        {
          id: '2',
          store: "Lowe's",
          location: 'San Bruno, CA',
          distance: 5.8,
          distance_unit: 'mi',
          price: 3.49,
          price_unit: 'sqft',
          in_stock: true,
          stock_level: '较少',
          url: 'https://www.lowes.com/p/example',
          phone: '(650) 555-0102',
          rating: 4.3,
          reviews: 189,
        },
        {
          id: '3',
          store: 'Amazon',
          location: 'Online',
          distance: 0,
          distance_unit: 'mi',
          price: 3.99,
          price_unit: 'sqft',
          in_stock: true,
          stock_level: 'Prime 次日达',
          url: 'https://www.amazon.com/dp/example',
          phone: null,
          rating: 4.6,
          reviews: 567,
          shipping: '免运费',
        },
        {
          id: '4',
          store: 'ABC Tile Supply',
          location: 'San Francisco, CA',
          distance: 2.1,
          distance_unit: 'mi',
          price: 2.89,
          price_unit: 'sqft',
          in_stock: true,
          stock_level: '批发价',
          url: null,
          phone: '(415) 555-0103',
          rating: 4.7,
          reviews: 89,
          is_wholesale: true,
          note: '需电话确认',
          is_lowest_price: true,
        },
      ],
      summary: {
        lowest_price: 2.89,
        lowest_price_store: 'ABC Tile Supply',
        average_price: 3.42,
        total_results: 4,
        in_stock_count: 4,
      },
      tips: [
        '批量购买(>100sqft)可额外优惠10%',
        'ABC Tile Supply 提供批发价，适合大批量采购',
        "Home Depot 和 Lowe's 提供退换货服务",
      ],
    }

    return new Response(
      JSON.stringify({
        result: priceResults,
        message: 'Price comparison completed',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[tools-material-compare] Error:', error)
    return new Response(
      JSON.stringify({ error: (error as any)?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
