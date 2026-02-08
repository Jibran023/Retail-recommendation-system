#!/usr/bin/env node
/**
 * Category Normalization Script
 *
 * Analyzes and normalizes product categories across all stores
 * Reclassifies generic categories (like "Grocery Products") into specific categories
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

  return response.json();
}

/**
 * Category classification keywords
 */
const CATEGORY_KEYWORDS = {
  'Beverages': [
    'drink', 'juice', 'beverage', 'soft drink', 'soda', 'pepsi', 'coke', 'coca cola',
    '7up', 'sprite', 'fanta', 'mountain dew', 'mirinda', 'sting', 'aquafina',
    'nestle', 'water', 'energy drink', 'malt', 'squash', 'syrup', 'ice cream',
    'milk', 'cream', 'yogurt', 'lassi', 'shake', 'smoothie'
  ],
  'Snacks & Confectionary': [
    'biscuit', 'cookie', 'wafer', 'cake', 'rusk', 'chocolate', 'candy',
    'snack', 'chips', 'crisp', 'bakery', 'bread', 'bun', 'roll', 'pastry',
    'confectionery', 'sweets', 'dessert', 'pudding', 'jelly', 'jam', 'honey'
  ],
  'Tea & Coffee': [
    'tea', 'coffee', 'green tea', 'black tea', 'herbal tea', 'instant coffee',
    'nescafe', 'tapal', 'lipton', 'vital', 'chai', 'caffe', 'milo'
  ],
  'Cooking Oil & Ghee': [
    'oil', 'ghee', 'banaspati', 'cooking oil', 'sunflower', 'canola', 'corn oil',
    'olive oil', 'mustard oil', 'dalda', 'eva', 'mezan', 'kisan'
  ],
  'Dairy & Eggs': [
    'milk powder', 'fresh milk', 'cream', 'butter', 'cheese', 'yogurt',
    'eggs', 'dairy', 'condensed milk', 'evaporated milk'
  ],
  'Rice & Grains': [
    'rice', 'basmati', 'grain', 'flour', 'wheat', 'atta', 'maida', 'pulses',
    'lentils', 'daal', 'beans', 'cereals'
  ],
  'Spices & Masalas': [
    'masala', 'spice', 'chili', 'mirch', 'turmeric', 'cumin', 'coriander',
    'pepper', 'salt', 'sugar', 'ginger', 'garlic', 'onion'
  ]
};

/**
 * Classify product into category based on name
 */
function classifyProduct(product) {
  const name = product.name.toLowerCase();
  const description = (product.description || '').toLowerCase();
  const searchText = `${name} ${description}`;

  // Check special categories first
  if (searchText.includes('tea') || searchText.includes('coffee')) {
    return 'Tea & Coffee';
  }

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return category;
      }
    }
  }

  // Default: keep existing category
  return product.category;
}

/**
 * Main function
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Category Normalization Tool                       ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Fetch all products that need reclassification
    console.log('📊 Fetching products from "Grocery Products" category...');
    const products = await supabaseFetch(
      'products?category=eq.Grocery%20Products&select=id,name,category,description&limit=1000'
    );

    console.log(`✅ Found ${products.length} products to analyze\n`);

    // 2. Classify products
    const categoryUpdates = [];
    const categoryCounts = {};

    for (const product of products) {
      const newCategory = classifyProduct(product);

      if (newCategory !== product.category) {
        categoryUpdates.push({
          id: product.id,
          name: product.name,
          oldCategory: product.category,
          newCategory: newCategory
        });

        categoryCounts[newCategory] = (categoryCounts[newCategory] || 0) + 1;
      }
    }

    console.log(`📋 Classification results:`);
    console.log(`   Products to reclassify: ${categoryUpdates.length}`);
    console.log(`   Products already correct: ${products.length - categoryUpdates.length}\n`);

    // 3. Show breakdown
    console.log('📦 Reclassification breakdown:');
    for (const [category, count] of Object.entries(categoryCounts)) {
      console.log(`   ${category}: ${count} products`);
    }
    console.log('');

    // 4. Update products in database
    if (categoryUpdates.length > 0) {
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
    } else {
      console.log('✅ All products are already correctly classified!');
    }

    // 5. Show final category distribution
    console.log('\n📊 Final category distribution:');
    const allProducts = await supabaseFetch('products?select=category');
    const finalCounts = {};
    allProducts.forEach(p => {
      finalCounts[p.category] = (finalCounts[p.category] || 0) + 1;
    });

    for (const [category, count] of Object.entries(finalCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${category}: ${count} products`);
    }

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  Category normalization complete!                       ║');
    console.log('╚══════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
