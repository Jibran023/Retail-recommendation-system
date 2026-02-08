#!/usr/bin/env node
/**
 * Delete Store Data
 *
 * Deletes all products and prices for a specific store
 * Usage: node delete-store-data.mjs <store-slug>
 * Example: node delete-store-data.mjs bin-hashim
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

/**
 * Fetch from Supabase
 */
async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  // DELETE requests may return empty response
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Main function
 */
async function main() {
  const storeSlug = process.argv[2];

  if (!storeSlug) {
    console.error('❌ Usage: node delete-store-data.mjs <store-slug>');
    console.error('   Example: node delete-store-data.mjs bin-hashim');
    process.exit(1);
  }

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Delete Store Data                                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n🏪 Store: ${storeSlug}\n`);

  try {
    // 1. Count prices before deletion
    console.log('📊 Counting data...');
    const prices = await supabaseFetch(`prices?store_id=eq.${storeSlug}&select=product_id`);

    // Get unique product IDs
    const productIds = [...new Set(prices.map(p => p.product_id))];

    console.log(`   Found ${prices.length} prices`);
    console.log(`   Found ${productIds.length} unique products\n`);

    if (productIds.length === 0) {
      console.log('✅ No data to delete. Exiting.');
      return;
    }

    // 2. Delete prices first (foreign key constraint)
    console.log('🗑️  Deleting prices...');
    await supabaseFetch(`prices?store_id=eq.${storeSlug}`, {
      method: 'DELETE',
    });
    console.log(`   ✅ Deleted ${prices.length} prices`);

    // 3. Delete products that have no more prices (orphaned products)
    console.log('🗑️  Checking for orphaned products...');
    let deletedProducts = 0;

    for (const productId of productIds) {
      // Check if product still has any prices from other stores
      const remainingPrices = await supabaseFetch(`prices?product_id=eq.${productId}&select=id`);

      if (remainingPrices.length === 0) {
        // No more prices for this product, safe to delete
        await supabaseFetch(`products?id=eq.${productId}`, {
          method: 'DELETE',
        });
        deletedProducts++;
      }
    }

    console.log(`   ✅ Deleted ${deletedProducts} products`);

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  Deletion Complete!                                    ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log(`\n✅ Successfully deleted ${products.length} products and ${prices.length} prices from ${storeSlug}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
