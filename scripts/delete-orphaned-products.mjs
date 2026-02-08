#!/usr/bin/env node
/**
 * Delete All Orphaned Products
 *
 * Fast deletion of products that have no prices
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

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

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Delete Orphaned Products                            ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Get all product IDs that have no prices
    console.log('📊 Finding orphaned products...');
    const products = await supabaseFetch('products?select=id');

    // Get all product IDs that have prices
    const prices = await supabaseFetch('prices?select=product_id');
    const productIdsWithPrices = new Set(prices.map(p => p.product_id));

    // Find orphaned products (products with no prices)
    const orphanedIds = products
      .map(p => p.id)
      .filter(id => !productIdsWithPrices.has(id));

    console.log(`   Found ${orphanedIds.length} orphaned products`);

    if (orphanedIds.length === 0) {
      console.log('✅ No orphaned products to delete.');
      return;
    }

    console.log('\n🗑️  Deleting orphaned products...');

    // Delete in batches of 50 to avoid URL length limits
    const batchSize = 50;
    let deleted = 0;

    for (let i = 0; i < orphanedIds.length; i += batchSize) {
      const batch = orphanedIds.slice(i, i + batchSize);
      // Use OR syntax for Supabase: ?or=(id.eq.1,id.eq.2,id.eq.3)
      const orClause = `or=(${batch.map(id => `id.eq.${id}`).join(',')})`;

      await supabaseFetch(`products?${orClause}`, {
        method: 'DELETE',
      });

      deleted += batch.length;
      console.log(`   Deleted ${deleted}/${orphanedIds.length}...`);
    }

    console.log(`\n✅ Successfully deleted ${deleted} orphaned products\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
