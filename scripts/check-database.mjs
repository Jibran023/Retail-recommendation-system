#!/usr/bin/env node
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const response = await fetch(process.env.VITE_SUPABASE_URL + '/rest/v1/products?select=category', {
  headers: {
    'apikey': process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': 'Bearer ' + process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  }
});

const products = await response.json();
const counts = {};

products.forEach(p => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});

console.log('Current database:');
console.log('='.repeat(60));
Object.entries(counts).sort((a,b) => b[1] - a[1]).forEach(([category, count]) => {
  console.log(`${category.padEnd(35)} ${count.toString().padStart(6)} products`);
});
console.log('='.repeat(60));
console.log(`Total: ${products.length} products\n`);
