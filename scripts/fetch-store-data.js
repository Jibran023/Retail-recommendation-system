/**
 * Store Data Fetcher Script
 *
 * Fetches product data from store APIs and loads into Supabase
 * Run with: node scripts/fetch-store-data.js
 *
 * Usage:
 *   node scripts/fetch-store-data.js              # Fetch from all stores
 *   node scripts/fetch-store-data.js imtiaz       # Fetch from Imtiaz only
 *   node scripts/fetch-store-data.js --clear      # Clear database first
 */

import { STORE_API_CONFIGS } from '../src/constants/storeApiConfig.js';
import { StoreApiClient } from '../src/services/storeApiClient.js';
import { batchTransformStoreProducts, groupProductsByName, mergeProductsForComparison } from '../src/services/dataTransformer.js';
import { batchUpsertProducts, clearAllProducts } from '../src/services/databaseLoader.js';

// Parse command line arguments
const args = process.argv.slice(2);
const targetStore = args.find(arg => !arg.startsWith('--'));
const shouldClear = args.includes('--clear');
const maxProductsPerSubsection = parseInt(args.find(arg => arg.startsWith('--max='))?.split('=')[1]) || 100;

/**
 * Fetch all data from a single store
 */
async function fetchFromStore(storeConfig, subsectionsToFetch = 5) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏪 Fetching from ${storeConfig.name}`);
  console.log(`${'='.repeat(60)}`);

  const client = new StoreApiClient(storeConfig);
  const allProducts = [];

  try {
    // 1. Fetch menu sections (categories)
    console.log(`\n📂 Fetching categories...`);
    const menuResponse = await client.fetchMenuSections();

    if (!menuResponse.data || menuResponse.data.length === 0) {
      console.log(`⚠️  No categories found for ${storeConfig.name}`);
      return [];
    }

    console.log(`✅ Found ${menuResponse.data.length} categories`);

    // 2. Limit categories to fetch (for testing)
    const categoriesToProcess = menuResponse.data.slice(0, subsectionsToFetch);

    // 3. Fetch products from each category/section
    for (const category of categoriesToProcess) {
      console.log(`\n   📂 Category: ${category.name}`);
      console.log(`   📋 Found ${category.section?.length || 0} subcategories`);

      // Limit subcategories to fetch (for testing)
      const sectionsToProcess = (category.section || []).slice(0, 3);

      for (const section of sectionsToProcess) {
        console.log(`      📦 Fetching products from "${section.name}"...`);

        try {
          // Fetch products from this subsection
          const products = await client.fetchAllProductsFromSubsection(
            section.id,
            maxProductsPerSubsection
          );

          console.log(`         ✅ Fetched ${products.length} products`);

          // Transform products
          const transformed = batchTransformStoreProducts(
            products,
            storeConfig.slug,
            category.name,
            section.name
          );

          allProducts.push(...transformed);
        } catch (error) {
          console.error(`         ❌ Failed to fetch from section ${section.name}:`, error.message);
          // Continue with next section
        }
      }
    }

    console.log(`\n✅ Total products fetched from ${storeConfig.name}: ${allProducts.length}`);
    return allProducts;

  } catch (error) {
    console.error(`❌ Error fetching from ${storeConfig.name}:`, error);
    return [];
  }
}

/**
 * Main fetch function
 */
async function main() {
  const startTime = Date.now();
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Store Data Fetcher - ETL Pipeline                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  try {
    // Clear database if requested
    if (shouldClear) {
      console.log('\n⚠️  Clearing all existing data...');
      await clearAllProducts();
    }

    // Determine which stores to fetch from
    const storesToFetch = targetStore
      ? [STORE_API_CONFIGS[targetStore]]
      : Object.values(STORE_API_CONFIGS);

    if (!storesToFetch.length) {
      console.error(`❌ Unknown store: ${targetStore}`);
      console.log(`Available stores: ${Object.keys(STORE_API_CONFIGS).join(', ')}`);
      process.exit(1);
    }

    // Fetch from all stores
    const allUnifiedProducts = [];
    for (const storeConfig of storesToFetch) {
      const products = await fetchFromStore(storeConfig);
      allUnifiedProducts.push(...products);
    }

    if (allUnifiedProducts.length === 0) {
      console.log('\n⚠️  No products fetched. Exiting.');
      process.exit(0);
    }

    // Group products by name for multi-store comparison
    console.log(`\n🔄 Grouping ${allUnifiedProducts.length} products by name...`);
    const groupedProducts = groupProductsByName(allUnifiedProducts);
    console.log(`✅ Created ${groupedProducts.size} product groups`);

    // Merge products for comparison
    console.log(`\n🔄 Merging products for multi-store comparison...`);
    const mergedProducts = mergeProductsForComparison(groupedProducts);
    console.log(`✅ Created ${mergedProducts.length} comparison products`);

    // Load into Supabase
    console.log(`\n💾 Loading ${mergedProducts.length} products into Supabase...`);
    const result = await batchUpsertProducts(mergedProducts);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n╔══════════════════════════════════════════════════════════╗`);
    console.log(`║  Complete!                                             ║`);
    console.log(`║  ✅ Success: ${result.success.toString().padStart(4)} products`);
    console.log(`║  ❌ Failed:   ${result.failed.toString().padStart(4)} products`);
    console.log(`║  ⏱️  Time:     ${elapsed}s`);
    console.log(`╚══════════════════════════════════════════════════════════╝`);

    process.exit(result.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
