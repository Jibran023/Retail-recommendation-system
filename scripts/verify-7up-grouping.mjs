#!/usr/bin/env node
/**
 * Verify 7UP Product Grouping
 *
 * Checks if 7UP products are properly grouped by base_product_name
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify7UPGrouping() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Verify 7UP Product Grouping                            ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%7UP%')
    .order('name');

  if (error) throw error;

  console.log(`✅ Found ${products.length} 7UP products\n`);

  // Group by base_product_name
  const grouped = {};
  products.forEach((p) => {
    const key = p.base_product_name || p.id;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(p);
  });

  console.log('📦 Current grouping by base_product_name:\n');

  Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([key, products]) => {
      console.log(`${key}:`);
      console.log(`   Count: ${products.length}`);
      products.forEach((p) => {
        console.log(`   • ID: ${p.id}`);
        console.log(`     Name: "${p.name}"`);
        console.log(`     Base: "${p.base_product_name}"`);
        console.log(`     Store prices: ${p.prices?.length || 0}`);
      });
      console.log('');
    });

  console.log('='.repeat(70));

  // Count how many unique base_product_names
  const uniqueBases = [...new Set(products.map((p) => p.base_product_name))];
  console.log(`\n📊 Summary:`);
  console.log(`   Total products: ${products.length}`);
  console.log(`   Unique base_product_names: ${uniqueBases.length}`);
  console.log(`   Expected groups: ${uniqueBases.length}`);
  console.log(`   Actual groups: ${Object.keys(grouped).length}`);

  if (Object.keys(grouped).length === uniqueBases.length) {
    console.log('\n✅ Products are properly grouped!');
  } else {
    console.log('\n⚠️  Products are NOT grouped correctly!');
    console.log('   base_product_name field may not have been updated.');
  }
}

verify7UPGrouping();
