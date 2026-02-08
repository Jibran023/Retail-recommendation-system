/**
 * Test script to fetch products from Store API
 * Run with: node test-products.js
 */

const STORES = {
  imtiaz: {
    name: 'Imtiaz Supermarket',
    baseUrl: 'https://shop.imtiaz.com.pk',
    restId: '55126',
    restBrId: '54940',
    appName: 'imtiazsuperstore',
  },
};

async function fetchProducts(store, subSectionId) {
  const url = `${store.baseUrl}/api/items-by-subsection?restId=${store.restId}&rest_brId=${store.restBrId}&sub_section_id=${subSectionId}&delivery_type=0&source=&brand_name=&min_price=0&max_price=&sort_by=name&sort=asc&page_no=1&per_page=5&start=0&limit=5`;

  console.log(`\n🛍️  Fetching products from ${store.name}...`);
  console.log(`Subsection ID: ${subSectionId}`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'App-name': store.appName,
        'Rest-Id': store.restId,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`\n✅ Status: ${result.status}`);
    console.log(`📦 Found ${result.data?.length || 0} products`);

    if (result.data && result.data.length > 0) {
      console.log('\n📋 First product structure:');
      console.log(JSON.stringify(result.data[0], null, 2));

      console.log('\n🏷️  All product names:');
      result.data.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || product.item_name} - ${product.price || 'N/A'}`);
      });
    }

    return result;
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    throw error;
  }
}

// Test with subsection ID from earlier test
async function main() {
  console.log('=== Product Structure Test ===');

  // Using subsection ID 43046 from the categories test
  await fetchProducts(STORES.imtiaz, '43046');

  console.log('\n=== Test Complete ===');
}

main().catch(console.error);
