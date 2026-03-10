import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This is placeholder data. In a real-world scenario, this function
// would scrape websites or call third-party APIs to get live pricing.
const mockData = {
  "wood": [
    { id: 1, store: 'Home Depot', name: '2 in. x 4 in. x 8 ft. #2 Prime Douglas Fir Stud', price: '$4.52 / each', distance: '1.5 miles', stock: '充足', address: '200 Bayshore Blvd, San Francisco, CA', link: '#' },
    { id: 2, store: 'Lowe\'s', name: '2-in x 4-in x 8-ft Whitewood Stud', price: '$4.65 / each', distance: '3.2 miles', stock: '充足', address: '520 High St, Oakland, CA', link: '#' },
    { id: 3, store: 'Golden State Lumber', name: '2x4-8\' SPF Stud', price: '$4.95 / each', distance: '5.1 miles', stock: '充足', address: '401 Du Bois St, San Rafael, CA', link: '#' },
  ],
  "flooring": [
    { id: 4, store: 'Lumber Liquidators', name: 'American Walnut Hardwood Flooring', price: '$9.99 / sq ft', distance: '4.5 miles', stock: '充足', address: '101 Flooring Ave, Palo Alto, CA', link: '#' },
    { id: 5, store: 'Home Depot', name: 'Engineered Walnut Wood Flooring', price: '$8.25 / sq ft', distance: '1.5 miles', stock: '充足', address: '200 Bayshore Blvd, San Francisco, CA', link: '#' },
  ],
  "default": [
    { id: 6, store: 'Home Depot', name: 'Sakrete 80 lb. High-Strength Concrete Mix', price: '$7.25 / bag', distance: '1.5 miles', stock: '充足', address: '200 Bayshore Blvd, San Francisco, CA', link: '#' },
    { id: 7, store: 'Lowe\'s', name: 'Sakrete 80-lb High Strength Concrete Mix', price: '$7.25 / bag', distance: '3.2 miles', stock: '充足', address: '520 High St, Oakland, CA', link: '#' },
    { id: 8, store: 'Central Concrete Supply', name: 'Sakrete Concrete Mix 80lb', price: '$7.80 / bag', distance: '6.8 miles', stock: '少量', address: '999 Construction Rd, San Jose, CA', link: '#' },
  ]
};

function getMockResults(searchText: string) {
  const lowerSearchText = searchText.toLowerCase();
  if (lowerSearchText.includes('wood') || lowerSearchText.includes('2x4') || lowerSearchText.includes('lumber') || lowerSearchText.includes('木')) {
    return mockData.wood;
  }
  if (lowerSearchText.includes('walnut') || lowerSearchText.includes('flooring')) {
    return mockData.flooring;
  }
  return mockData.default;
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchText } = await req.json();
    console.log("[nova-act-search] Received search text:", searchText);

    // Simulate network delay for a more realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = getMockResults(searchText);
    console.log("[nova-act-search] Returning mock results:", results);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("[nova-act-search] Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})