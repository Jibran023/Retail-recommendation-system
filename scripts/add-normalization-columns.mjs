#!/usr/bin/env node
/**
 * Add Normalization Columns to Products Table
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Add Normalization Columns                           ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    console.log('📋 Adding columns to products table...\n');

    const columns = [
      { name: 'base_product_name', type: 'TEXT' },
      { name: 'brand_name', type: 'TEXT' },
      { name: 'size_value', type: 'NUMERIC' },
      { name: 'size_unit', type: 'TEXT' },
      { name: 'size_display', type: 'TEXT' },
    ];

    for (const column of columns) {
      console.log(`   Adding ${column.name}...`);

      // Use raw SQL to add column
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE products ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`,
      }).catch(async () => {
        // If RPC doesn't exist, try direct SQL via REST
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sql: `ALTER TABLE products ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return { error: null };
      });

      if (error) {
        console.log(`      ⚠️  ${error.message}`);
      } else {
        console.log(`      ✅ Added ${column.name}`);
      }
    }

    console.log('\n✅ Columns added successfully!');
    console.log('\n⚠️  If you see errors above, you may need to add the columns manually in Supabase SQL Editor:');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS base_product_name TEXT;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_name TEXT;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS size_value NUMERIC;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS size_unit TEXT;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS size_display TEXT;');

  } catch (error) {
    console.error('\n❌ Error:', error);
    console.log('\nPlease add the columns manually in Supabase SQL Editor using the commands above.');
    process.exit(1);
  }
}

main();
