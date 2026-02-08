#!/usr/bin/env node
/**
 * 7UP Product Normalization Analysis
 *
 * Analyzes all 7UP products to:
 * 1. Normalize sizes to ml
 * 2. Identify duplicates (e.g., 1.5L vs 1500ml)
 * 3. Create canonical product names
 * 4. Show what needs to be merged
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Size unit conversions to ml (for liquids)
 */
const UNIT_TO_ML = {
  'ML': 1,
  'ML.': 1,
  'MILLILITRES': 1,
  'MILLILITERS': 1,
  'MLTIN': 1,
  'MLTIN.': 1,
  'MLBOTTLE': 1,
  'MLBP': 1,
  'L': 1000,
  'LITRE': 1000,
  'LITRES': 1000,
  'LITER': 1000,
  'LITERS': 1000,
  'LITREBOTTLE': 1000,
  'LITRESBOTTLE': 1000,
  'LITRE.': 1000,
  'LITRES.': 1000,
  'L.': 1000,
};

/**
 * Parse size string and convert to ml
 */
function parseSizeToMl(sizeString) {
  if (!sizeString) return null;

  // Match patterns like "1.5 LITRE", "500 ML", "250 MLTIN", etc.
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:ML|ML\.|MILLILITRES|MILLILITERS|MLTIN|MLTIN\.|MLBOTTLE|MLBP)\b/i,
    /(\d+(?:\.\d+)?)\s*(?:L|LITRE|LITRES|LITER|LITERS|LITREBOTTLE|LITRESBOTTLE|LITRE\.|LITRES\.|L\.|LIT)\b/i,
  ];

  for (const pattern of patterns) {
    const match = sizeString.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[0].replace(match[1], '').trim().toUpperCase();

      // Find multiplier
      for (const [unitName, multiplier] of Object.entries(UNIT_TO_ML)) {
        if (unit.includes(unitName)) {
          return {
            value,
            unit,
            ml: Math.round(value * multiplier),
            original: sizeString,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Generate canonical product name
 */
function generateCanonicalName(baseName, sizeInMl) {
  // Convert ml to human-readable format
  let sizeDisplay;

  if (sizeInMl >= 1000) {
    const litres = (sizeInMl / 1000).toFixed(1).replace(/\.0$/, '');
    sizeDisplay = `${litres}L`;
  } else {
    sizeDisplay = `${sizeInMl}ml`;
  }

  // Clean up base name (uppercase for consistency)
  const cleanBaseName = baseName.toUpperCase().trim();

  return `${cleanBaseName} ${sizeDisplay}`;
}

/**
 * Main analysis function
 */
async function analyze7UPProducts() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     7UP Product Normalization Analysis                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Fetch all 7UP products
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

    // Analyze each product
    const analyzedProducts = products.map((product) => {
      const sizeInfo = parseSizeToMl(product.size_display);

      return {
        id: product.id,
        name: product.name,
        original_size: product.size_display,
        base_product_name: product.base_product_name,
        category: product.category,
        size_ml: sizeInfo ? sizeInfo.ml : null,
        size_value: product.size_value,
        size_unit: product.size_unit,
        prices: product.prices || [],
      };
    });

    // Group by normalized size
    const groupedBySize = {};

    analyzedProducts.forEach((product) => {
      if (!product.size_ml) {
        const key = 'unknown';
        if (!groupedBySize[key]) groupedBySize[key] = [];
        groupedBySize[key].push(product);
        return;
      }

      const key = product.size_ml;
      if (!groupedBySize[key]) {
        groupedBySize[key] = [];
      }
      groupedBySize[key].push(product);
    });

    // Sort by size
    const sortedSizes = Object.keys(groupedBySize).map(Number).sort((a, b) => a - b);

    console.log('📦 7UP Products Grouped by Normalized Size:\n');
    console.log('='.repeat(70));

    sortedSizes.forEach((sizeMl) => {
      const products = groupedBySize[sizeMl];

      // Get human-readable size
      let sizeDisplay;
      if (sizeMl >= 1000) {
        const litres = (sizeMl / 1000).toFixed(1).replace(/\.0$/, '');
        sizeDisplay = `${litres}L`;
      } else {
        sizeDisplay = `${sizeMl}ml`;
      }

      console.log(`\n📌 Size: ${sizeDisplay} (${sizeMl}ml)`);
      console.log(`   Products in this group: ${products.length}`);

      // Show each product
      products.forEach((product) => {
        const prices = product.prices || [];
        const priceInfo = prices.map((p) => {
          const storeName = p.store_id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          return `${storeName}: PKR ${(p.price_cents / 100).toFixed(0)}`;
        }).join(' | ');

        console.log(`   • ${product.name}`);
        console.log(`     Original size: "${product.original_size}"`);
        console.log(`     Base name: "${product.base_product_name}"`);
        if (priceInfo) {
          console.log(`     Prices: ${priceInfo}`);
        }
        console.log('');
      });

      // Check if products have different names for the same size
      const uniqueNames = [...new Set(products.map((p) => p.base_product_name))];
      if (uniqueNames.length > 1) {
        console.log(`   ⚠️  Multiple base names found: ${uniqueNames.join(', ')}`);
        console.log(`   ✅ Should all be: "7UP ${sizeDisplay}"`);
      }
    });

    // Show duplicates
    console.log('\n' + '='.repeat(70));
    console.log('\n🔍 Duplicates Analysis:\n');

    let totalDuplicates = 0;
    const canonicalProducts = [];

    sortedSizes.forEach((sizeMl) => {
      const products = groupedBySize[sizeMl];

      if (products.length > 1) {
        // These should be merged
        totalDuplicates += products.length - 1;

        let sizeDisplay;
        if (sizeMl >= 1000) {
          const litres = (sizeMl / 1000).toFixed(1).replace(/\.0$/, '');
          sizeDisplay = `${litres}L`;
        } else {
          sizeDisplay = `${sizeMl}ml`;
        }

        const canonicalName = `7UP ${sizeDisplay}`;

        console.log(`📦 ${canonicalName}`);
        console.log(`   Can be merged from ${products.length} products:`);

        // Get all stores and prices
        const allPrices = [];
        products.forEach((product) => {
          (product.prices || []).forEach((price) => {
            allPrices.push({
              product_id: product.id,
              product_name: product.name,
              store_id: price.store_id,
              price_cents: price.price_cents,
              availability: price.availability,
            });
          });
        });

        // Group by store
        const byStore = {};
        allPrices.forEach((price) => {
          const key = price.store_id;
          if (!byStore[key]) {
            byStore[key] = [];
          }
          byStore[key].push(price);
        });

        // Show prices by store
        Object.entries(byStore).forEach(([storeId, prices]) => {
          const storeName = storeId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          console.log(`   • ${storeName}: ${prices.length} variant(s)`);
          prices.forEach((p) => {
            console.log(`      - ${p.product_name}: PKR ${(p.price_cents / 100).toFixed(0)}`);
          });
        });

        canonicalProducts.push({
          canonical_name: canonicalName,
          size_ml: sizeMl,
          size_display: sizeDisplay,
          product_ids: products.map((p) => p.id),
          products,
        });

        console.log('');
      }
    });

    console.log('='.repeat(70));
    console.log(`\n📊 Summary:`);
    console.log(`   Total 7UP products: ${products.length}`);
    console.log(`   Unique sizes: ${sortedSizes.length}`);
    console.log(`   Products to merge: ${totalDuplicates}`);
    console.log(`   Final canonical products: ${canonicalProducts.length}\n`);

    // Show recommended canonical products
    console.log('✅ Recommended Canonical 7UP Products:\n');
    canonicalProducts.forEach((cp) => {
      console.log(`   • ${cp.canonical_name}`);
      console.log(`      Merges: ${cp.product_ids.join(', ').substring(0, 60)}...`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

analyze7UPProducts();
