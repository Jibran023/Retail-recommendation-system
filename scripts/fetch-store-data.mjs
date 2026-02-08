#!/usr/bin/env node
/**
 * Store Data Fetcher - ETL Pipeline
 *
 * Fetches product data from store APIs and loads into Supabase
 *
 * Usage:
 *   npm run fetch-data                  # Fetch from all stores (3 categories each)
 *   npm run fetch-data:imtiaz           # Fetch from Imtiaz only
 *   npm run fetch-data:all              # Fetch all (10 categories each)
 *
 * Environment:
 *   Uses .env.local for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { STORE_API_CONFIGS } from '../src/constants/storeApiConfig.ts';
import { StoreApiClient } from '../src/services/storeApiClient.ts';
import { priceToCents } from '../src/services/dataTransformer.ts';
import { batchUpsertProductsWithPrices } from '../src/services/databaseLoader.ts';

/**
 * Generate a URL-friendly slug from a product name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

/**
 * Fetch all data from a single store
 */
async function fetchFromStore(storeConfig, maxCategories = 3, maxSubsectionsPerSection = 2) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏪 Fetching from ${storeConfig.name}`);
  console.log(`${'='.repeat(60)}`);

  const client = new StoreApiClient(storeConfig);
  const productsToUpsert = new Map(); // productId -> product with prices

  try {
    // 1. Fetch menu sections (categories)
    console.log(`\n📂 Fetching categories...`);
    const menuResponse = await client.fetchMenuSections();

    if (!menuResponse.data || menuResponse.data.length === 0) {
      console.log(`⚠️  No categories found for ${storeConfig.name}`);
      return [];
    }

    console.log(`✅ Found ${menuResponse.data.length} categories`);
    console.log(`📋 Processing ${Math.min(maxCategories, menuResponse.data.length)} categories...`);

    // 2. Process limited categories
    const categoriesToProcess = menuResponse.data.slice(0, maxCategories);
    let totalProductsProcessed = 0;

    for (const category of categoriesToProcess) {
      console.log(`\n   📂 Category: ${category.name}`);
      console.log(`   📋 Found ${category.section?.length || 0} sections`);

      if (!category.section || category.section.length === 0) {
        continue;
      }

      // Limit sections per category
      const sectionsToProcess = category.section.slice(0, maxSubsectionsPerSection);

      for (const section of sectionsToProcess) {
        console.log(`      📦 Section: "${section.name}" (ID: ${section.id})`);

        // Fetch subsections for this section
        try {
          const subSectionsResponse = await client.fetchSubSections(section.id);

          // API returns data as an array, dish_sub_sections is inside the first element
          if (!subSectionsResponse.data || !Array.isArray(subSectionsResponse.data) || subSectionsResponse.data.length === 0) {
            console.log(`         ⚠️  No subsections found (empty data array)`);
            continue;
          }

          const firstSection = subSectionsResponse.data[0];
          if (!firstSection.dish_sub_sections || firstSection.dish_sub_sections.length === 0) {
            console.log(`         ⚠️  No subsections found (no dish_sub_sections)`);
            continue;
          }

          const subSections = firstSection.dish_sub_sections;
          console.log(`         📋 Found ${subSections.length} subsections`);

          // Process all subsections
          for (const subSection of subSections) {
            console.log(`            ↳ "${subSection.name}" (ID: ${subSection.id})`);

            try {
              // Fetch products from this subsection (limit to 50 for testing)
              const products = await client.fetchAllProductsFromSubsection(subSection.id, 50);

              if (!products || products.length === 0) {
                console.log(`              ⚠️  No products`);
                continue;
              }

              console.log(`              ✅ Fetched ${products.length} products`);
              totalProductsProcessed += products.length;

              // Transform products to our format
              for (const product of products) {
                const productId = `${storeConfig.slug}_${product.id}`;

                // Use sub-section name as category (e.g., "Milk & Dairy Drinks", "Tea & Coffee")
                // For stores without sub-sections, fall back to section name, then category name
                const categoryName = subSection.name || section.name || category.name;

                // Create or update product in map
                if (!productsToUpsert.has(productId)) {
                  productsToUpsert.set(productId, {
                    id: productId,
                    name: product.name,
                    slug: generateSlug(product.name),
                    category: categoryName,
                    description: product.desc || '',
                    image_url: product.img_url || '',
                    prices: [],
                  });
                }

                // Add price for this store
                const productRecord = productsToUpsert.get(productId);
                productRecord.prices.push({
                  store_id: storeConfig.slug,
                  price_cents: priceToCents(product.price),
                  availability: product.availability === 1,
                  scraped_at: product.lastUpdateAt || new Date().toISOString(),
                });
              }

            } catch (error) {
              console.error(`              ❌ Failed: ${error.message}`);
              // Continue with next subsection
            }
          }

          console.log(`         📦 Total products in "${section.name}": ${subSections.length} subsections processed`);

        } catch (error) {
          console.error(`         ❌ Failed to fetch subsections: ${error.message}`);
          // Continue with next section
        }
      }
    }

    console.log(`\n✅ Total unique products from ${storeConfig.name}: ${productsToUpsert.size}`);
    console.log(`✅ Total products processed: ${totalProductsProcessed}`);
    return Array.from(productsToUpsert.values());

  } catch (error) {
    console.error(`❌ Error fetching from ${storeConfig.name}:`, error);
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  const startTime = Date.now();

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Store Data Fetcher - API to Supabase              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📊 Supabase: ${SUPABASE_URL}`);
  console.log(`📦 Limit: ${3} categories per store\n`);

  try {
    // Determine which stores to fetch from
    const targetStore = process.argv[2]; // Get from command line
    const storesToFetch = targetStore
      ? [STORE_API_CONFIGS[targetStore]]
      : Object.values(STORE_API_CONFIGS);

    if (!storesToFetch.length || storesToFetch[0] === undefined) {
      console.error(`❌ Unknown store: ${targetStore}`);
      console.log(`\nAvailable stores: ${Object.keys(STORE_API_CONFIGS).join(', ')}`);
      process.exit(1);
    }

    // Fetch from all stores
    const allProducts = [];
    for (const storeConfig of storesToFetch) {
      if (!storeConfig) continue;
      const products = await fetchFromStore(storeConfig, 3, 2);
      allProducts.push(...products);
    }

    if (allProducts.length === 0) {
      console.log('\n⚠️  No products fetched. Exiting.');
      process.exit(0);
    }

    // Load into Supabase
    console.log(`\n💾 Loading ${allProducts.length} products into Supabase...`);
    const result = await batchUpsertProductsWithPrices(allProducts);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n╔══════════════════════════════════════════════════════════╗`);
    console.log(`║  Complete!                                             ║`);
    console.log(`║  ✅ Products loaded: ${allProducts.length}`);
    console.log(`║  ✅ Prices loaded:   ${result.success}`);
    console.log(`║  ❌ Failed:          ${result.failed}`);
    console.log(`║  ⏱️  Time:            ${elapsed}s`);
    console.log(`╚══════════════════════════════════════════════════════════╝`);

    process.exit(result.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main();
