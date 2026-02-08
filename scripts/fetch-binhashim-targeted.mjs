#!/usr/bin/env node
/**
 * Targeted Bin Hashim Data Fetcher
 *
 * Fetches only categories that match Imtiaz's dataset:
 * - Tea & Coffee
 * - Beverages
 * - Snacks & Confectionary
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { STORE_API_CONFIGS } from '../src/constants/storeApiConfig.ts';
import { StoreApiClient } from '../src/services/storeApiClient.ts';
import { priceToCents } from '../src/services/dataTransformer.ts';
import { batchUpsertProductsWithPrices } from '../src/services/databaseLoader.ts';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

/**
 * Targeted sub-sections that match Imtiaz's categories
 */
const TARGETED_SUBSECTIONS = {
  // From Grocery Products (menuId: 4430, sectionId: 42162)
  'Tea & Coffee': { id: 45210, menuId: 4430, sectionId: 42162 },

  // From Sweets & Confectionary (menuId: 4433, sectionId: 42165)
  'Drinks & Beverages': { id: 45229, menuId: 4433, sectionId: 42165 },
  'Snacks & Nimko': { id: 45230, menuId: 4433, sectionId: 42165 },
  'Drinking Water': { id: 45231, menuId: 4433, sectionId: 42165 },
  'Juices': { id: 45236, menuId: 4433, sectionId: 42165 },
  'Biscuits & Cakes': { id: 45237, menuId: 4433, sectionId: 42165 },
  'Chocolate & Sweets': { id: 45238, menuId: 4433, sectionId: 42165 },
  'Instant Drinks': { id: 45278, menuId: 4433, sectionId: 42165 },
};

/**
 * Fetch products from targeted sub-sections
 */
async function fetchTargetedProducts(storeConfig) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏪 Fetching from ${storeConfig.name}`);
  console.log(`🎯 Targeted: ${Object.keys(TARGETED_SUBSECTIONS).length} sub-sections`);
  console.log(`${'='.repeat(60)}`);

  const client = new StoreApiClient(storeConfig);
  const productsToUpsert = new Map();

  for (const [categoryName, subsection] of Object.entries(TARGETED_SUBSECTIONS)) {
    console.log(`\n📦 Fetching: ${categoryName} (ID: ${subsection.id})`);

    try {
      const products = await client.fetchAllProductsFromSubsection(subsection.id, 500);

      if (!products || products.length === 0) {
        console.log(`   ⚠️  No products found`);
        continue;
      }

      console.log(`   ✅ Found ${products.length} products`);

      for (const product of products) {
        const productId = `${storeConfig.slug}_${product.id}`;

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

        const productRecord = productsToUpsert.get(productId);
        productRecord.prices.push({
          store_id: storeConfig.slug,
          price_cents: priceToCents(product.price),
          availability: product.availability === 1,
          scraped_at: product.lastUpdateAt || new Date().toISOString(),
        });
      }

    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }

  console.log(`\n✅ Total unique products from ${storeConfig.name}: ${productsToUpsert.size}`);
  return Array.from(productsToUpsert.values());
}

async function main() {
  const startTime = Date.now();

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Targeted Bin Hashim Data Fetcher                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n📊 Supabase: ${SUPABASE_URL}`);
  console.log(`🎯 Fetching only: Tea & Coffee, Beverages, Snacks & Confectionary\n`);

  try {
    const storeConfig = STORE_API_CONFIGS.binHashim;

    console.log('📋 Target sub-sections:');
    Object.entries(TARGETED_SUBSECTIONS).forEach(([name, info]) => {
      console.log(`   - ${name} (ID: ${info.id})`);
    });
    console.log('');

    const products = await fetchTargetedProducts(storeConfig);

    if (products.length === 0) {
      console.log('\n⚠️  No products fetched. Exiting.');
      process.exit(0);
    }

    // Show category breakdown
    console.log('\n📊 Category breakdown:');
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

    // Load into Supabase
    console.log(`\n💾 Loading ${products.length} products into Supabase...`);
    const result = await batchUpsertProductsWithPrices(products);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n╔══════════════════════════════════════════════════════════╗`);
    console.log(`║  Complete!                                             ║`);
    console.log(`║  ✅ Products loaded: ${products.length}`);
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

main();
