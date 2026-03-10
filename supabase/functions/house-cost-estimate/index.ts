// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ModuleEstimate {
  id: string;
  name: string;
  nameEn: string;
  area: string;
  materialPriceRange: string;
  laborPriceRange: string;
  totalRange: string;
  confidence: number;
  details: string;
}

interface HouseAnalysis {
  houseType: string;
  houseTypeEn: string;
  estimatedTotalArea: string;
  overallCondition: string;
  modules: ModuleEstimate[];
  totalEstimate: string;
  recommendations: string[];
}

// Use OpenAI to analyze the house image and estimate costs
async function analyzeHouseImage(imageBase64: string, openaiKey: string, selectedModule?: string): Promise<HouseAnalysis> {
  console.log("[house-cost-estimate] Calling OpenAI Vision API to analyze house...");
  
  const systemPrompt = `你是一位经验丰富的美国建筑估价师，专门为装修承包商提供房屋造价估算服务。

你的任务是分析房屋照片，识别建筑模块，并根据美国当前市场价格提供造价估算。

请以 JSON 格式返回分析结果，包含以下字段：
{
  "houseType": "房屋类型（中文）",
  "houseTypeEn": "House Type (English)",
  "estimatedTotalArea": "预估总面积 (sq ft)",
  "overallCondition": "整体状况评估",
  "modules": [
    {
      "id": "模块ID（如 roof, wall, window, door, foundation 等）",
      "name": "模块名称（中文）",
      "nameEn": "Module Name (English)",
      "area": "预估面积 (sq ft)",
      "materialPriceRange": "材料单价范围 ($/sq ft)",
      "laborPriceRange": "人工单价范围 ($/sq ft)",
      "totalRange": "该模块总价范围 ($)",
      "confidence": 0.85,
      "details": "详细说明，包括建议的材料类型、施工注意事项等"
    }
  ],
  "totalEstimate": "整体翻新预估总价范围 ($)",
  "recommendations": ["建议1", "建议2", "建议3"]
}

价格参考（2024年美国市场）：
- 屋顶 (Roof): 材料 $4-8/sq ft, 人工 $3-6/sq ft
- 外墙 (Siding): 材料 $3-12/sq ft, 人工 $2-5/sq ft
- 窗户 (Windows): $300-1500/个，含安装
- 大门 (Entry Door): $500-3000/个，含安装
- 地基 (Foundation): 维修 $5-15/sq ft
- 车道 (Driveway): 混凝土 $8-18/sq ft
- 甲板 (Deck): 木质 $15-35/sq ft, 复合材料 $25-50/sq ft

请根据照片中房屋的实际状况、大小、材料类型等因素调整估价。`;

  const userPrompt = selectedModule 
    ? `请重点分析这张房屋照片中的"${selectedModule}"模块，提供详细的造价估算。同时也简要分析其他可见的建筑模块。`
    : `请分析这张房屋照片，识别所有可见的建筑模块（如屋顶、外墙、窗户、门、地基等），并为每个模块提供造价估算。`;

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
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt
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
      max_tokens: 2000,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[house-cost-estimate] OpenAI API error:", errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  console.log("[house-cost-estimate] AI analysis complete");
  
  try {
    const analysis = JSON.parse(content);
    return analysis as HouseAnalysis;
  } catch (e) {
    console.error("[house-cost-estimate] Failed to parse AI response:", content);
    throw new Error("Failed to parse AI analysis result");
  }
}

// Search for material prices using SerpApi
async function searchMaterialPrices(materialName: string, serpApiKey: string): Promise<any[]> {
  console.log("[house-cost-estimate] Searching material prices for:", materialName);
  
  const serpApiUrl = new URL('https://serpapi.com/search.json');
  serpApiUrl.searchParams.set('engine', 'google_shopping');
  serpApiUrl.searchParams.set('q', materialName);
  serpApiUrl.searchParams.set('location', 'United States');
  serpApiUrl.searchParams.set('hl', 'en');
  serpApiUrl.searchParams.set('gl', 'us');
  serpApiUrl.searchParams.set('api_key', serpApiKey);

  const response = await fetch(serpApiUrl.toString());
  
  if (!response.ok) {
    console.error("[house-cost-estimate] SerpApi error");
    return [];
  }

  const data = await response.json();
  return (data.shopping_results || []).slice(0, 3).map((item: any) => ({
    name: item.title,
    price: item.price,
    store: item.source,
    link: item.link,
    thumbnail: item.thumbnail
  }));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageBase64, selectedModule, location } = await req.json();
    console.log("[house-cost-estimate] Received request:", { 
      hasImage: !!imageBase64,
      selectedModule,
      location 
    });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error("[house-cost-estimate] OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: 'OPENAI_API_KEY 未配置。请在 Supabase Edge Function secrets 中添加。',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: '请提供房屋照片' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Analyze the house image with AI
    const analysis = await analyzeHouseImage(imageBase64, OPENAI_API_KEY, selectedModule);

    // Optionally search for material prices for the selected module
    let materialSuggestions: any[] = [];
    if (selectedModule && SERPAPI_KEY) {
      const moduleInfo = analysis.modules.find(m => 
        m.id === selectedModule || 
        m.name.includes(selectedModule) || 
        m.nameEn.toLowerCase().includes(selectedModule.toLowerCase())
      );
      
      if (moduleInfo) {
        // Search for relevant materials
        const searchTerms: Record<string, string> = {
          'roof': 'roofing shingles architectural',
          'wall': 'vinyl siding panels',
          'window': 'double hung vinyl window',
          'door': 'fiberglass entry door',
          'foundation': 'concrete foundation repair kit',
          'deck': 'composite decking boards',
          'driveway': 'concrete driveway sealer',
        };
        
        const searchTerm = searchTerms[selectedModule.toLowerCase()] || `${moduleInfo.nameEn} materials`;
        materialSuggestions = await searchMaterialPrices(searchTerm, SERPAPI_KEY);
      }
    }

    console.log("[house-cost-estimate] Returning analysis with", analysis.modules.length, "modules");

    return new Response(
      JSON.stringify({ 
        analysis,
        materialSuggestions,
        location: location || 'United States'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error("[house-cost-estimate] Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})