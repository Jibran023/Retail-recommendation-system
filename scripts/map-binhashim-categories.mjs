#!/usr/bin/env node
/**
 * Bin Hashim Category Mapping Script
 *
 * Maps Bin Hashim's sub-section categories to our standard categories
 * This is needed because Bin Hashim uses specific names like "Milk & Dairy Drinks"
 * while our system uses categories like "Dairy & Eggs"
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

/**
 * Get environment variable
 */
function getEnvVar(name) {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  return undefined;
}

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnvVar('VITE_SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY');

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

  // PATCH/DELETE requests may return empty response
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Category mappings for Bin Hashim
 * Maps their sub-section names to our standard categories
 */
const BIN_HASHIM_CATEGORY_MAP = {
  // Direct matches
  'Tea & Coffee': 'Tea & Coffee',
  'Tea': 'Tea & Coffee',
  'Coffee': 'Tea & Coffee',

  // Dairy products
  'Milk & Dairy Drinks': 'Dairy & Eggs',
  'Milk': 'Dairy & Eggs',
  'Dairy': 'Dairy & Eggs',
  'Cheese': 'Dairy & Eggs',
  'Butter & Margarine': 'Dairy & Eggs',
  'Cream': 'Dairy & Eggs',
  'Yogurt': 'Dairy & Eggs',
  'Eggs': 'Dairy & Eggs',

  // Beverages
  'Beverages': 'Beverages',
  'Cold Drinks': 'Beverages',
  'Juices': 'Beverages',
  'Energy Drinks': 'Beverages',
  'Squash & Syrup': 'Beverages',
  'Squash': 'Beverages',
  'Syrup': 'Beverages',
  'Water': 'Beverages',

  // Cooking oil
  'Cooking Oil': 'Cooking Oil & Ghee',
  'Cooking Oil & Ghee': 'Cooking Oil & Ghee',
  'Oil': 'Cooking Oil & Ghee',
  'Ghee': 'Cooking Oil & Ghee',
  'Olive Oil': 'Cooking Oil & Ghee',
  'Banapsati': 'Cooking Oil & Ghee',

  // Rice & grains
  'Rice': 'Rice & Grains',
  'Rice & Grains': 'Rice & Grains',
  'Flour & Atta': 'Rice & Grains',
  'Flour': 'Rice & Grains',
  'Atta': 'Rice & Grains',
  'Daal & Pulses': 'Rice & Grains',
  'Daal': 'Rice & Grains',
  'Pulses': 'Rice & Grains',
  'Grains': 'Rice & Grains',
  'Pasta': 'Rice & Grains',
  'Noodles': 'Rice & Grains',

  // Snacks & confectionary
  'Sweets & Confectionary': 'Snacks & Confectionary',
  'Confectionary': 'Snacks & Confectionary',
  'Biscuits & Cookies': 'Snacks & Confectionary',
  'Biscuits': 'Snacks & Confectionary',
  'Cookies': 'Snacks & Confectionary',
  'Chocolates': 'Snacks & Confectionary',
  'Chocolate': 'Snacks & Confectionary',
  'Candy': 'Snacks & Confectionary',
  'Chips & Snacks': 'Snacks & Confectionary',
  'Chips': 'Snacks & Confectionary',
  'Snacks': 'Snacks & Confectionary',
  'Bakery': 'Snacks & Confectionary',
  'Cakes': 'Snacks & Confectionary',
  'Pastries': 'Snacks & Confectionary',

  // Spices & masalas
  'Spices': 'Spices & Masalas',
  'Spices & Masalas': 'Spices & Masalas',
  'Masalas': 'Spices & Masalas',
  'Masala': 'Spices & Masalas',
  'Herbs & Spices': 'Spices & Masalas',
  'Salt': 'Spices & Masalas',
  'Sugar': 'Spices & Masalas',
};

/**
 * Map Bin Hashim category to standard category
 */
function mapCategory(binHashimCategory) {
  // First try exact match
  if (BIN_HASHIM_CATEGORY_MAP[binHashimCategory]) {
    return BIN_HASHIM_CATEGORY_MAP[binHashimCategory];
  }

  // Then try partial match (check if any keyword is in the category name)
  const lowerCategory = binHashimCategory.toLowerCase();

  for (const [keyword, standardCategory] of Object.entries(BIN_HASHIM_CATEGORY_MAP)) {
    if (lowerCategory.includes(keyword.toLowerCase())) {
      return standardCategory;
    }
  }

  // Default: return original category
  return binHashimCategory;
}

/**
 * Main function
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Bin Hashim Category Mapper                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Fetch all Bin Hashim product IDs from prices table
    console.log('📊 Fetching Bin Hashim products...');
    const prices = await supabaseFetch(
      'prices?store_id=eq.bin-hashim&select=product_id'
    );

    if (prices.length === 0) {
      console.log('⚠️  No Bin Hashim products found');
      return;
    }

    // 2. Fetch the actual products (in batches to avoid URL overflow)
    const productIds = prices.map(p => p.product_id);
    const batchSize = 100;
    const fetchedProducts = [];

    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      // Build OR clause for Supabase
      const orClause = `or=(${batch.map(id => `id.eq.${id}`).join(',')})`;
      const batchProducts = await supabaseFetch(
        `products?${orClause}&select=id,name,category`
      );
      fetchedProducts.push(...batchProducts);
    }

    const products = fetchedProducts;

    console.log(`✅ Found ${products.length} Bin Hashim products\n`);

    // 2. Analyze current categories
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    console.log('📦 Current Bin Hashim categories:');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} products`);
      });
    console.log('');

    // 3. Map categories and collect updates
    const categoryUpdates = [];
    const mappingCounts = {};

    for (const product of products) {
      const newCategory = mapCategory(product.category);

      if (newCategory !== product.category) {
        categoryUpdates.push({
          id: product.id,
          name: product.name,
          oldCategory: product.category,
          newCategory: newCategory
        });

        const key = `${product.category} → ${newCategory}`;
        mappingCounts[key] = (mappingCounts[key] || 0) + 1;
      }
    }

    console.log(`📋 Products to reclassify: ${categoryUpdates.length}`);
    console.log(`   Products already correct: ${products.length - categoryUpdates.length}\n`);

    if (categoryUpdates.length === 0) {
      console.log('✅ All products are already correctly classified!');
      return;
    }

    // 4. Show mapping breakdown
    console.log('📦 Category mapping breakdown:');
    Object.entries(mappingCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([mapping, count]) => {
        console.log(`   ${mapping}: ${count} products`);
      });
    console.log('');

    // 5. Confirm before updating
    console.log('⚠️  This will update ' + categoryUpdates.length + ' products in the database.');
    console.log('    Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // 6. Update products in database
    console.log('💾 Updating products in database...');

    let success = 0;
    let failed = 0;

    for (const update of categoryUpdates) {
      try {
        await supabaseFetch(`products?id=eq.${update.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ category: update.newCategory }),
        });
        success++;
      } catch (error) {
        console.error(`   ❌ Failed to update "${update.name}": ${error.message}`);
        failed++;
      }
    }

    console.log(`\n✅ Successfully updated: ${success} products`);
    if (failed > 0) {
      console.log(`❌ Failed to update: ${failed} products`);
    }

    // 7. Show final category distribution
    console.log('\n📊 Final Bin Hashim category distribution:');

    // Re-fetch products using the same method as before
    const finalProducts = [];
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      const orClause = `or=(${batch.map(id => `id.eq.${id}`).join(',')})`;
      const batchProducts = await supabaseFetch(
        `products?${orClause}&select=category`
      );
      finalProducts.push(...batchProducts);
    }

    const finalCounts = {};
    finalProducts.forEach(p => {
      finalCounts[p.category] = (finalCounts[p.category] || 0) + 1;
    });

    Object.entries(finalCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} products`);
      });

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  Category mapping complete!                             ║');
    console.log('╚══════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
