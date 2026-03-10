import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchText, location } = await req.json();
    console.log("[nova-act-search] Received search request:", { searchText, location });

    const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');
    
    if (!SERPAPI_KEY) {
      console.error("[nova-act-search] SERPAPI_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured. Please add SERPAPI_KEY to your Supabase Edge Function secrets.',
          results: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Build the search query for building materials
    const query = searchText || 'building materials';
    const searchLocation = location || 'San Francisco, California, United States';
    
    // Call SerpApi Google Shopping API for real product data
    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.set('engine', 'google_shopping');
    serpApiUrl.searchParams.set('q', query);
    serpApiUrl.searchParams.set('location', searchLocation);
    serpApiUrl.searchParams.set('hl', 'en');
    serpApiUrl.searchParams.set('gl', 'us');
    serpApiUrl.searchParams.set('api_key', SERPAPI_KEY);

    console.log("[nova-act-search] Calling SerpApi:", serpApiUrl.toString().replace(SERPAPI_KEY, '***'));

    const response = await fetch(serpApiUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[nova-act-search] SerpApi error:", errorText);
      throw new Error(`SerpApi request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("[nova-act-search] SerpApi response received, shopping_results count:", data.shopping_results?.length || 0);

    // Transform SerpApi results to our format
    const results = (data.shopping_results || []).slice(0, 5).map((item: any, index: number) => ({
      id: index + 1,
      store: item.source || 'Unknown Store',
      name: item.title || 'Unknown Product',
      price: item.price || 'Price not available',
      distance: 'Online', // SerpApi doesn't provide distance for online results
      stock: item.in_stock !== false ? '充足' : '缺货',
      address: item.link ? new URL(item.link).hostname : 'Online Store',
      link: item.link || '#',
      thumbnail: item.thumbnail || null,
      rating: item.rating || null,
      reviews: item.reviews || null,
    }));

    console.log("[nova-act-search] Returning results:", results.length);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error("[nova-act-search] Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message, results: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
