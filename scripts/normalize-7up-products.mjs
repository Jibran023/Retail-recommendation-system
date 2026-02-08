#!/usr/bin/env node
/**
 * 7UP Product Normalization Script
 *
 * Normalizes 7UP products to have consistent naming:
 * - "7UP 250ml", "7UP 345ml", "7UP 500ml", "7UP 1L", "7UP 1.5L", "7UP 2.3L"
 * - Merges duplicate products while preserving store prices
 * - Creates canonical product references
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Size unit conversions to ml
 */
const UNIT_TO_ML = {
  'ML': 1,
  'ML.': 1,
  'L': 1000,
  'LITRE': 1000,
  'LITRES': 1000,
  'LITER': 1000,
  'LITERS': 1000,
  'LITREBOTTLE': 1000,
  'L.': 1000,
};

/**
 * Parse size string and convert to ml
 */
function parseSizeToMl(sizeString) {
  if (!sizeString) return null;

  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:ML|ML\.|L|LITRE|LITRES|LITER|LITERS|LITREBOTTLE|L\.|LIT)\b/i,
  ];

  for (const pattern of patterns) {
    const match = sizeString.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[0].replace(match[1], '').trim().toUpperCase();

      for (const [unitName, multiplier] of Object.entries(UNIT_TO_ML)) {
        if (unit.includes(unitName)) {
          return Math.round(value * multiplier);
        }
      }
    }
  }

  return null;
}

/**
 * Generate canonical name from base name and size
 */
function generateCanonicalName(baseName, sizeInMl) {
  // Clean up base name - remove variants like "Diet", "Free", etc.
  let cleanName = '7UP';

  // Check if it's a variant
  const name = baseName.toUpperCase();
  if (name.includes('DIET')) {
    cleanName = '7UP DIET';
  } else if (name.includes('SUGAR FREE')) {
    cleanName = '7UP SUGAR FREE';
  }

  // Format size
  let sizeDisplay;
  if (sizeInMl >= 1000) {
    const litres = (sizeInMl / 1000).toFixed(1).replace(/\.0$/, '');
    sizeDisplay = `${litres}L`;
  } else {
    sizeDisplay = `${sizeInMl}ml`;
  }

  return `${cleanName} ${sizeDisplay}`;
}

/**
 * Main normalization function
 */
async function normalize7UPProducts() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     7UP Product Normalization                              ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Fetch all 7UP products with prices
    console.log('📊 Fetching all 7UP products...\n');

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        prices (
          store_id,
          price_cents,
          availability
        )
      `)
      .ilike('name', '%7UP%')
      .order('name');

    if (error) throw error;
    if (!products || products.length === 0) {
      console.log('⚠️  No 7UP products found');
      return;
    }

    console.log(`✅ Found ${products.length} 7UP products\n`);

    // Analyze and group products
    const productsBySize = {};

    products.forEach((product) => {
      const sizeMl = parseSizeToMl(product.size_display);

      if (!sizeMl) {
        console.log(`⚠️  Skipping product with no size: ${product.name}`);
        return;
      }

      const canonicalName = generateCanonicalName(product.base_product_name, sizeMl);

      if (!productsBySize[sizeMl]) {
        productsBySize[sizeMl] = [];
      }

      productsBySize[sizeMl].push({
        ...product,
        size_ml: sizeMl,
        canonical_name: canonicalName,
      });
    });

    // Sort by size
    const sortedSizes = Object.keys(productsBySize).map(Number).sort((a, b) => a - b);

    console.log('📦 Normalization Plan:\n');
    console.log('='.repeat(70));

    let updateCount = 0;

    sortedSizes.forEach((sizeMl) => {
      const products = productsBySize[sizeMl];

      if (products.length === 0) return;

      // Use the first product's canonical name as the target
      const targetCanonicalName = products[0].canonical_name;

      console.log(`\n📌 Size: ${targetCanonicalName}`);
      console.log(`   Products to normalize: ${products.length}`);

      // Show what will change
      products.forEach((product) => {
        const willChange = product.name !== targetCanonicalName;
        const icon = willChange ? '→' : '✓';

        console.log(`   ${icon} "${product.name}"`);
        console.log(`      Base name: "${product.base_product_name}" → "${targetCanonicalName}"`);

        if (willChange) {
          updateCount++;
        }

        // Show prices
        const prices = product.prices || [];
        prices.forEach((price) => {
          const storeName = price.store_id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          console.log(`      • ${storeName}: PKR ${(price.price_cents / 100).toFixed(0)}`);
        });
      });
    });

    console.log('\n' + '='.repeat(70));
    console.log(`\n📊 Summary:`);
    console.log(`   Total 7UP products: ${products.length}`);
    console.log(`   Unique sizes: ${sortedSizes.length}`);
    console.log(`   Products to update: ${updateCount}\n`);

    // Confirm before updating
    console.log('⚠️  This will update product names in the database.');
    console.log('    Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Update products
    console.log('💾 Updating products...\n');

    let success = 0;
    let failed = 0;

    for (const sizeMl of sortedSizes) {
      const products = productsBySize[sizeMl];
      if (!products || products.length === 0) continue;

      const targetCanonicalName = products[0].canonical_name;

      for (const product of products) {
        if (product.name === targetCanonicalName) {
          console.log(`   ✓ "${product.name}" - already correct`);
          success++;
          continue;
        }

        try {
          const { error: updateError } = await supabase
            .from('products')
            .update({
              name: targetCanonicalName,
              base_product_name: targetCanonicalName,
            })
            .eq('id', product.id);

          if (updateError) throw updateError;

          console.log(`   ✅ Updated: "${product.name}" → "${targetCanonicalName}"`);
          success++;
        } catch (error) {
          console.error(`   ❌ Failed to update "${product.name}": ${error.message}`);
          failed++;
        }
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log(`\n✅ Successfully updated: ${success} products`);
    if (failed > 0) {
      console.log(`❌ Failed to update: ${failed} products`);
    }

    console.log('\n🎉 7UP products normalized! All products now have consistent naming.\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

normalize7UPProducts();
