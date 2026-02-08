#!/usr/bin/env node
/**
 * Verify Product Normalization
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function supabaseFetch(endpoint) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Product Normalization Verification                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Get stats
    const products = await supabaseFetch('products?select=id,base_product_name,brand_name,size_value,size_unit,size_display,name,category&limit=1000');

    console.log('📊 Normalization Statistics:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Products with base name: ${products.filter(p => p.base_product_name).length}`);
    console.log(`   Products with brand: ${products.filter(p => p.brand_name).length}`);
    console.log(`   Products with size: ${products.filter(p => p.size_value).length}`);

    // Group by base product
    const groups = {};
    products.forEach(p => {
      if (p.base_product_name) {
        const key = p.base_product_name;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(p);
      }
    });

    console.log(`\n📦 Product Groups: ${Object.keys(groups).length}`);

    // Show top groups
    const sortedGroups = Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 15);

    console.log('\n🏆 Top 15 Product Groups by Variant Count:\n');

    sortedGroups.forEach(([baseName, variants], index) => {
      const sizes = variants
        .filter(v => v.size_value && v.size_unit)
        .map(v => `${v.size_value} ${v.size_unit}`)
        .sort((a, b) => parseFloat(a) - parseFloat(b));

      const category = variants[0].category;
      const brand = variants[0].brand_name || '';

      console.log(`${index + 1}. ${baseName} (${category})`);
      if (brand) console.log(`   Brand: ${brand}`);
      console.log(`   Variants: ${variants.length}`);
      if (sizes.length > 0) {
        console.log(`   Sizes: ${sizes.join(', ')}`);
      }
      console.log('');
    });

    // Show examples of specific products
    console.log('📋 Example: 7UP Variants:\n');
    const sevenUp = products.filter(p => p.base_product_name === '7UP');
    sevenUp.forEach(p => {
      console.log(`   ${p.name}`);
      console.log(`      Size: ${p.size_display} (${p.size_value} ${p.size_unit})`);
      console.log(`      Category: ${p.category}`);
    });

    console.log('\n📋 Example: TAPAL Tea Variants:\n');
    const tapal = products.filter(p => p.brand_name === 'TAPAL').slice(0, 10);
    tapal.forEach(p => {
      console.log(`   ${p.name}`);
      console.log(`      Base: ${p.base_product_name}`);
      console.log(`      Size: ${p.size_display}`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
