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
    // Verify JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const { image, areas, quality = 'standard', property_type = 'residential' } = body

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: image (base64 string)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // TODO: Integrate with Claude Vision API for house analysis
    // For now, we'll simulate the estimation result
    
    // Quality multipliers
    const qualityMultipliers = {
      economy: 0.8,
      standard: 1.0,
      premium: 1.3,
    }

    const multiplier = qualityMultipliers[quality as keyof typeof qualityMultipliers] || 1.0

    // Simulated estimation result
    const estimationResult = {
      property_info: {
        type: property_type,
        style: '单层住宅',
        year_built: '1985',
        square_footage: 1850,
        bedrooms: 3,
        bathrooms: 2,
        garage: '2车位',
        lot_size: '0.25英亩',
      },
      detected_areas: areas || [
        { name: '客厅', sqft: 350, condition: '良好' },
        { name: '厨房', sqft: 200, condition: '需翻新' },
        { name: '主卧', sqft: 280, condition: '良好' },
        { name: '次卧', sqft: 180, condition: '良好' },
        { name: '浴室', sqft: 60, condition: '需翻新' },
        { name: '车库', sqft: 400, condition: '良好' },
      ],
      renovation_estimate: {
        total_min: Math.round(45000 * multiplier),
        total_max: Math.round(65000 * multiplier),
        currency: 'USD',
        breakdown: [
          {
            category: '厨房翻新',
            min: Math.round(15000 * multiplier),
            max: Math.round(25000 * multiplier),
            items: [
              { name: '橱柜', cost: Math.round(5000 * multiplier) },
              { name: '台面', cost: Math.round(3000 * multiplier) },
              { name: '电器', cost: Math.round(4000 * multiplier) },
              { name: '人工', cost: Math.round(3000 * multiplier) },
            ],
          },
          {
            category: '浴室翻新',
            min: Math.round(8000 * multiplier),
            max: Math.round(12000 * multiplier),
            items: [
              { name: '瓷砖', cost: Math.round(2000 * multiplier) },
              { name: '洁具', cost: Math.round(3000 * multiplier) },
              { name: '人工', cost: Math.round(3000 * multiplier) },
            ],
          },
          {
            category: '地板更换',
            min: Math.round(5000 * multiplier),
            max: Math.round(8000 * multiplier),
            items: [
              { name: '材料', cost: Math.round(3000 * multiplier) },
              { name: '人工', cost: Math.round(2500 * multiplier) },
            ],
          },
          {
            category: '油漆',
            min: Math.round(3000 * multiplier),
            max: Math.round(5000 * multiplier),
            items: [
              { name: '材料', cost: Math.round(1000 * multiplier) },
              { name: '人工', cost: Math.round(3000 * multiplier) },
            ],
          },
          {
            category: '其他',
            min: Math.round(5000 * multiplier),
            max: Math.round(8000 * multiplier),
            items: [
              { name: '照明', cost: Math.round(2000 * multiplier) },
              { name: '门窗', cost: Math.round(3000 * multiplier) },
              { name: '杂项', cost: Math.round(2000 * multiplier) },
            ],
          },
        ],
      },
      timeline: {
        estimated_weeks: 8,
        phases: [
          { name: '拆除', duration: '1周' },
          { name: '结构工程', duration: '2周' },
          { name: '水电安装', duration: '2周' },
          { name: '装修', duration: '2周' },
          { name: '收尾', duration: '1周' },
        ],
      },
      recommendations: [
        '厨房和浴室是投资回报率最高的翻新项目',
        '建议使用节能电器，可节省长期运营成本',
        '考虑增加智能家居功能，提升房屋价值',
        '保持翻新风格与房屋整体一致',
      ],
      confidence: 0.87,
      disclaimer: '此估算仅供参考，实际费用可能因具体情况而异。建议获取专业报价。',
    }

    return new Response(
      JSON.stringify({ 
        result: estimationResult,
        message: 'House estimation completed',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[tools-house-estimate] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})