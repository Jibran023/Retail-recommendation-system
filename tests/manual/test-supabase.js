/**
 * Test script to verify Supabase integration
 *
 * Run this in your browser console after the app loads at http://localhost:5173
 *
 * Expected results:
 * - Should fetch 4 products from the database
 * - Each product should have prices from multiple stores
 */

async function testSupabaseIntegration() {
  console.log('🧪 Testing Supabase Integration...\n');

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('📋 Configuration:');
  console.log('URL:', SUPABASE_URL);
  console.log('Key:', SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing');
  console.log('');

  try {
    // Test 1: Fetch products
    console.log('🔍 Test 1: Fetching products...');
    const productsResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!productsResponse.ok) {
      throw new Error(`Failed to fetch products: ${productsResponse.status}`);
    }

    const products = await productsResponse.json();
    console.log('✅ Products fetched:', products.length, 'items');
    console.table(products.map(p => ({ id: p.id, name: p.name, category: p.category })));
    console.log('');

    // Test 2: Fetch prices
    console.log('🔍 Test 2: Fetching prices...');
    const pricesResponse = await fetch(`${SUPABASE_URL}/rest/v1/prices?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!pricesResponse.ok) {
      throw new Error(`Failed to fetch prices: ${pricesResponse.status}`);
    }

    const prices = await pricesResponse.json();
    console.log('✅ Prices fetched:', prices.length, 'items');
    console.log('');

    // Test 3: Fetch stores
    console.log('🔍 Test 3: Fetching stores...');
    const storesResponse = await fetch(`${SUPABASE_URL}/rest/v1/stores?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!storesResponse.ok) {
      throw new Error(`Failed to fetch stores: ${storesResponse.status}`);
    }

    const stores = await storesResponse.json();
    console.log('✅ Stores fetched:', stores.length, 'items');
    console.table(stores.map(s => ({ id: s.id, name: s.name, location: s.location })));
    console.log('');

    // Test 4: Search functionality
    console.log('🔍 Test 4: Testing search (cooking oil)...');
    const searchResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?name=ilike.*cooking*&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Failed to search: ${searchResponse.status}`);
    }

    const searchResults = await searchResponse.json();
    console.log('✅ Search results:', searchResults.length, 'items');
    console.table(searchResults.map(p => ({ name: p.name, category: p.category })));
    console.log('');

    console.log('🎉 All tests passed! Supabase integration is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Try searching in the app for: "cooking oil", "rice", or "lentils"');
    console.log('2. Verify products display with prices from multiple stores');
    console.log('3. Test category filtering if categories are available');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Details:', error);
  }
}

// Run the test
testSupabaseIntegration();
