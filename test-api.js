/**
 * Test script to call Store APIs
 * Run with: node test-api.js
 */

// Store configurations from Postman collection
const STORES = {
  imtiaz: {
    name: 'Imtiaz Supermarket',
    baseUrl: 'https://shop.imtiaz.com.pk',
    restId: '55126',
    restBrId: '54940',
    appName: 'imtiazsuperstore',
  },
  binHashim: {
    name: 'Bin Hashim',
    baseUrl: 'https://binhashimonline.pk',
    restId: '55248',
    restBrId: '55203',
    appName: 'binhashimpharmacysupermarket',
  },
  alJadeed: {
    name: 'Al-Jadeed',
    baseUrl: 'https://www.aljadeed.pk',
    restId: '55232',
    restBrId: '55181',
    appName: 'aljadeedsupermarket',
  },
};

/**
 * Fetch menu sections (categories) from a store
 */
async function fetchMenuSections(store) {
  const url = `${store.baseUrl}/api/menu-section?restId=${store.restId}&rest_brId=${store.restBrId}&delivery_type=0&source=`;

  console.log(`\n📦 Fetching categories from ${store.name}...`);
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

    const data = await response.json();
    console.log(`✅ Success! Found ${data.data?.length || 0} categories`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error(`❌ Error fetching from ${store.name}:`, error.message);
    throw error;
  }
}

/**
 * Fetch items (products) from a subsection
 */
async function fetchItems(store, subSectionId) {
  const url = `${store.baseUrl}/api/items-by-subsection?restId=${store.restId}&rest_brId=${store.restBrId}&sub_section_id=${subSectionId}&delivery_type=0&source=&brand_name=&min_price=0&max_price=&sort_by=name&sort=asc&page_no=1&per_page=24&start=0&limit=24`;

  console.log(`\n🛍️  Fetching products from ${store.name} (subsection: ${subSectionId})...`);
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

    const data = await response.json();
    console.log(`✅ Success! Found ${data.data?.length || 0} products`);
    console.log('First product:', JSON.stringify(data.data?.[0], null, 2));
    return data;
  } catch (error) {
    console.error(`❌ Error fetching from ${store.name}:`, error.message);
    throw error;
  }
}

// Main test
async function main() {
  console.log('=== Store API Test ===\n');

  // Test 1: Fetch categories from Imtiaz
  console.log('TEST 1: Fetch Categories from Imtiaz');
  const imtiazCategories = await fetchMenuSections(STORES.imtiaz);

  // If categories were fetched, test fetching products from first subsection
  if (imtiazCategories?.data?.[0]) {
    const firstSubSectionId = imtiazCategories.data[0].sub_section?.[0]?.id;
    if (firstSubSectionId) {
      console.log('\nTEST 2: Fetch Products from First Subsection');
      await fetchItems(STORES.imtiaz, firstSubSectionId);
    }
  }

  // Test 3: Fetch categories from Bin Hashim
  console.log('\nTEST 3: Fetch Categories from Bin Hashim');
  await fetchMenuSections(STORES.binHashim);

  // Test 4: Fetch categories from Al-Jadeed
  console.log('\nTEST 4: Fetch Categories from Al-Jadeed');
  await fetchMenuSections(STORES.alJadeed);

  console.log('\n=== All Tests Complete ===');
}

// Run the test
main().catch(console.error);
