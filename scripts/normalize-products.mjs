#!/usr/bin/env node
/**
 * Product Normalization Script
 *
 * Normalizes products by:
 * 1. Extracting base product name (e.g., "7UP" from "7UP 1 LITRE BOTTLE")
 * 2. Extracting and normalizing sizes (ml, L, g, kg)
 * 3. Grouping products by base name and size
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

/**
 * Size unit conversion map
 * Converts all units to standard base units (ml for liquids, g for solids)
 */
const UNIT_CONVERSIONS = {
  // Liquid units to ml
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

  // Solid units to g
  'GM': 1,
  'G': 1,
  'GM.': 1,
  'GRAM': 1,
  'GRAMS': 1,
  'GR': 1,
  'GRM': 1,
  'KG': 1000,
  'KILOGRAM': 1000,
  'KILOGRAMS': 1000,
  'KGS': 1000,

  // Piece/unit (keep as is)
  'PCS': 1,
  'PIECES': 1,
  'S': 1,
  'PACK': 1,
  'PAK': 1,
  'POUCH': 1,
  'BOX': 1,
  'BOTTLE': 1,
  'TIN': 1,
  'JAR': 1,
  'BAG': 1,
};

/**
 * Common brand/product prefixes to detect
 */
const BRAND_PATTERNS = [
  /^7UP\s+/i,
  /^PEPSI\s+/i,
  /^COKE\s+/i,
  /^COCA-COLA\s+/i,
  /^MIRINDA\s+/i,
  /^MOUNTAIN DEW\s+/i,
  /^DEW\s+/i,
  /^SLICE\s+/i,
  /^STING\s+/i,
  /^RED BULL\s+/i,
  /^REDBULL\s+/i,
  /^AQUAFINA\s+/i,
  /^NESTLE\s+/i,
  /^DAIRY MILK\s+/i,
  /^CADBURY\s+/i,
  /^KITKAT\s+/i,
  /^TAPAL\s+/i,
  /^VITAL\s+/i,
  /^LAYS\s+/i,
  /^KURKURE\s+/i,
  /^DORITOS\s+/i,
  /^CHEETOS\s+/i,
  /^OREO\s+/i,
  /^SOOPER\s+/i,
  /^MARIE\s+/i,
  /^RIFFLE\s+/i,
  /^PEPSODENT\s+/i,
  /^COLGATE\s+/i,
  /^SUNSILK\s+/i,
  /^DOVE\s+/i,
  /^LUX\s+/i,
  /^ lifebuoy\s+/i,
  /^DETTOL\s+/i,
  /^HARPIC\s+/i,
  /^SURF\s+EXCEL\s+/i,
  /^ARIEL\s+/i,
  /^TIDE\s+/i,
];

/**
 * Parse product name to extract base product and size
 */
function parseProductName(productName) {
  let name = productName.trim();
  let baseProduct = name;
  let sizeValue = null;
  let sizeUnit = null;
  let sizeDisplay = null;

  // Extract size patterns (number + unit)
  // Matches: "500 ML", "1.5 LITRE", "170 GM", "1 KG", "24S", "6PCS"
  const sizePatterns = [
    /(\d+(?:\.\d+)?)\s*(?:ML|ML\.|MILLILITRES|MILLILITERS|MLTIN|MLTIN\.|MLBOTTLE|MLBP)\b/i,
    /(\d+(?:\.\d+)?)\s*(?:L|LITRE|LITRES|LITER|LITERS|LITREBOTTLE|LITRESBOTTLE)\b/i,
    /(\d+(?:\.\d+)?)\s*(?:GM|G|GM\.|GRAM|GRAMS|GR|GRM)\b/i,
    /(\d+(?:\.\d+)?)\s*(?:KG|KILOGRAM|KILOGRAMS|KGS)\b/i,
    /(\d+)\s*(?:PCS|PIECES|S|PACK|PAK|POUCH|BOX|BOTTLE|TIN|JAR|BAG)\b/i,
  ];

  for (const pattern of sizePatterns) {
    const match = name.match(pattern);
    if (match) {
      sizeValue = parseFloat(match[1]);
      const rawUnit = match[0].replace(match[1], '').trim();

      // Find the base unit for conversion
      for (const [unit, multiplier] of Object.entries(UNIT_CONVERSIONS)) {
        if (rawUnit.toUpperCase().includes(unit)) {
          sizeUnit = unit.toLowerCase();
          sizeDisplay = match[0].toUpperCase();

          // Convert to base unit
          if (multiplier !== 1) {
            sizeValue = sizeValue * multiplier;
            sizeUnit = multiplier === 1000 ? (rawUnit.match(/ML|GM|G|LITRE|LITER/i) ? 'ml' : 'g') : sizeUnit;
          } else {
            sizeUnit = sizeUnit.toLowerCase().replace('ml', 'ml').replace('gm', 'g');
          }
          break;
        }
      }

      if (sizeDisplay) {
        // Remove the size from the name to get base product
        baseProduct = name.replace(match[0], '').trim();
        break;
      }
    }
  }

  // Remove common trailing descriptors from base product
  baseProduct = baseProduct
    .replace(/\s+(BOTTLE|TIN|BOX|PACK|PAK|POUCH|JAR|BAG|BARS|SACHET|IMP|LOCAL|BP|PET|GLASS)\b.*$/i, '')
    .trim();

  // Detect brand from base product
  let brand = null;
  for (const pattern of BRAND_PATTERNS) {
    const match = baseProduct.match(pattern);
    if (match) {
      brand = match[0].trim();
      break;
    }
  }

  return {
    baseProduct,
    brand,
    sizeValue,
    sizeUnit,
    sizeDisplay: sizeDisplay || '',
  };
}

/**
 * Add new columns to products table
 */
async function addNormalizationColumns() {
  console.log('📋 Adding normalization columns to products table...');

  try {
    // Add base_product_name column
    await supabaseFetch('rpc/add_base_product_name_column', {
      method: 'POST',
      body: JSON.stringify({}),
    }).catch(async () => {
      // If RPC doesn't exist, use ALTER TABLE directly
      console.log('   Adding base_product_name column...');
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS base_product_name TEXT;',
        }),
      }).catch(() => {
        console.log('   ⚠️  Could not add column automatically. Please add manually:');
        console.log('      ALTER TABLE products ADD COLUMN base_product_name TEXT;');
      });
    });

    console.log('   ✅ Columns added or already exist');
  } catch (error) {
    console.log(`   ⚠️  ${error.message}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Product Normalization                               ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Fetch all products
    console.log('📊 Fetching all products...');
    const products = await supabaseFetch('products?select=id,name,category&limit=1000');

    console.log(`✅ Found ${products.length} products\n`);

    // 2. Parse product names
    console.log('🔍 Parsing product names...');
    const parsedProducts = products.map(product => {
      const parsed = parseProductName(product.name);
      return {
        ...product,
        ...parsed,
      };
    });

    // 3. Show sample of parsed products
    console.log('\n📋 Sample parsed products:');
    const samples = [
      '7UP 1 LITRE BOTTLE',
      'PEPSI 500 ML BOTTLE',
      'TAPAL TEZDUM TEA 170GM',
      'LAYS CHIPS 12GM FRENCH CHEESE',
      'CADBURY DAIRY MILK CHOCOLATE 26GM',
    ];

    samples.forEach(sampleName => {
      const parsed = parseProductName(sampleName);
      console.log(`   "${sampleName}"`);
      console.log(`      Base: ${parsed.baseProduct}`);
      console.log(`      Brand: ${parsed.brand || 'N/A'}`);
      console.log(`      Size: ${parsed.sizeValue} ${parsed.sizeUnit} (${parsed.sizeDisplay})`);
      console.log('');
    });

    // 4. Group by base product
    console.log('📦 Grouping products by base name...');
    const baseProductGroups = {};

    parsedProducts.forEach(product => {
      const key = `${product.category}|${product.baseProduct}`;
      if (!baseProductGroups[key]) {
        baseProductGroups[key] = {
          category: product.category,
          baseProduct: product.baseProduct,
          brand: product.brand,
          count: 0,
          sizes: {},
        };
      }
      baseProductGroups[key].count++;

      if (product.sizeValue && product.sizeUnit) {
        const sizeKey = `${product.sizeValue} ${product.sizeUnit}`;
        if (!baseProductGroups[key].sizes[sizeKey]) {
          baseProductGroups[key].sizes[sizeKey] = 0;
        }
        baseProductGroups[key].sizes[sizeKey]++;
      }
    });

    const groupCount = Object.keys(baseProductGroups).length;
    console.log(`✅ Created ${groupCount} product groups\n`);

    // 5. Show top product groups
    console.log('📊 Top 20 product groups by variant count:');
    const sortedGroups = Object.values(baseProductGroups)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    sortedGroups.forEach(group => {
      const sizes = Object.keys(group.sizes).sort((a, b) => {
        const aVal = parseFloat(a);
        const bVal = parseFloat(b);
        return aVal - bVal;
      });

      console.log(`   ${group.baseProduct} (${group.category}): ${group.count} products`);
      if (sizes.length > 0) {
        console.log(`      Sizes: ${sizes.join(', ')}`);
      }
    });

    console.log('\n⚠️  To complete normalization, you need to add these columns to the products table:');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS base_product_name TEXT;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_name TEXT;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS size_value NUMERIC;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS size_unit TEXT;');
    console.log('   ALTER TABLE products ADD COLUMN IF NOT EXISTS size_display TEXT;');
    console.log('');
    console.log('Then run the update script to populate these columns.');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
