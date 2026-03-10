import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use OpenAI to identify the material from the image
async function identifyMaterialFromImage(imageBase64: string, openaiKey: string): Promise<string> {
  console.log("[nova-act-search] Calling OpenAI Vision API to identify material...");
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是美国的建筑材料专家，有多年的建筑装修材料采购经验，熟悉各种装修材料。
你的任务是识别图片中的建筑材料，并返回一个精确的英文搜索词，用于在 Google Shopping 上搜索该产品。

规则：
1. 仔细观察图片中的品牌名称、产品名称、规格等信息
2. 返回的搜索词应该包含：品牌名 + 产品名 + 关键规格（如重量、尺寸等）
3. 只返回搜索词，不要返回其他任何内容
4. 搜索词必须是英文

例如：
- 如果看到 SAKRETE 品牌的混凝土，返回 "SAKRETE High-Strength Concrete Mix 80 lb"
- 如果看到 QUIKRETE 水泥，返回 "QUIKRETE Concrete Mix 60 lb"
- 如果看到 2x4 木材，返回 "2x4x8 lumber pine"`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '请识别这张图片中的建筑材料，返回精确的英文搜索词：'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[nova-act-search] OpenAI API error:", errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const identifiedMaterial = data.choices[0]?.message?.content?.trim() || '';
  console.log("[nova-act-search] AI identified material:", identifiedMaterial);
  
  return identifiedMaterial;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchText, location, imageBase64 } = await req.json();
    console.log("[nova-act-search] Received search request:", { 
      searchText, 
      location, 
      hasImage: !!imageBase64 
    });

    const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!SERPAPI_KEY) {
      console.error("[nova-act-search] SERPAPI_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: 'SERPAPI_KEY 未配置。请在 Supabase Edge Function secrets 中添加。',
          results: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Determine the search query
    let query = searchText;
    let identifiedProduct = null;

    // If no search text provided but we have an image, use AI to identify the material
    if (!searchText && imageBase64) {
      if (!OPENAI_API_KEY) {
        console.error("[nova-act-search] OPENAI_API_KEY not configured for image recognition");
        return new Response(
          JSON.stringify({ 
            error: 'OPENAI_API_KEY 未配置。图片识别功能需要 OpenAI API Key。请在 Supabase Edge Function secrets 中添加。',
            results: [] 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      // Use AI to identify the material from the image
      identifiedProduct = await identifyMaterialFromImage(imageBase64, OPENAI_API_KEY);
      query = identifiedProduct;
    }

    // Fallback if still no query
    if (!query) {
      query = 'building materials';
    }

    const searchLocation = location || 'San Francisco, California, United States';
    
    // Call SerpApi Google Shopping API for real product data
    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.set('engine', 'google_shopping');
    serpApiUrl.searchParams.set('q', query);
    serpApiUrl.searchParams.set('location', searchLocation);
    serpApiUrl.searchParams.set('hl', 'en');
    serpApiUrl.searchParams.set('gl', 'us');
    serpApiUrl.searchParams.set('api_key', SERPAPI_KEY);

    console.log("[nova-act-search] Calling SerpApi with query:", query);

    const response = await fetch(serpApiUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[nova-act-search] SerpApi error:", errorText);
      throw new Error(`SerpApi request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("[nova-act-search] SerpApi response received, shopping_results count:", data.shopping_results?.length || 0);

    // Transform SerpApi results to our format
    const results = (data.shopping_results || []).slice(0, 6).map((item: any, index: number) => ({
      id: index + 1,
      store: item.source || 'Unknown Store',
      name: item.title || 'Unknown Product',
      price: item.price || 'Price not available',
      distance: 'Online',
      stock: item.in_stock !== false ? '有货' : '缺货',
      address: item.source || 'Online Store',
      link: item.link || '#',
      thumbnail: item.thumbnail || null,
      rating: item.rating || null,
      reviews: item.reviews || null,
    }));

    console.log("[nova-act-search] Returning results:", results.length);

    return new Response(
      JSON.stringify({ 
        results,
        identifiedProduct: identifiedProduct, // Return what AI identified
        searchQuery: query
      }),
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
