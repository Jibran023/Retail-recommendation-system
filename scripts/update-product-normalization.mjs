#!/usr/bin/env node
/**
 * Update Products with Normalization Data
 *
 * Populates the normalization columns for all products
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
 */
const UNIT_CONVERSIONS = {
  'ML': 1, 'ML.': 1, 'MILLILITRES': 1, 'MILLILITERS': 1, 'MLTIN': 1, 'MLTIN.': 1, 'MLBOTTLE': 1, 'MLBP': 1,
  'L': 1000, 'LITRE': 1000, 'LITRES': 1000, 'LITER': 1000, 'LITERS': 1000, 'LITREBOTTLE': 1000, 'LITRESBOTTLE': 1000,
  'GM': 1, 'G': 1, 'GM.': 1, 'GRAM': 1, 'GRAMS': 1, 'GR': 1, 'GRM': 1,
  'KG': 1000, 'KILOGRAM': 1000, 'KILOGRAMS': 1000, 'KGS': 1000,
  'PCS': 1, 'PIECES': 1, 'S': 1, 'PACK': 1, 'PAK': 1, 'POUCH': 1, 'BOX': 1, 'BOTTLE': 1, 'TIN': 1, 'JAR': 1, 'BAG': 1,
};

const BRAND_PATTERNS = [
  /^7UP\s+/i, /^PEPSI\s+/i, /^COKE\s+/i, /^COCA-COLA\s+/i, /^MIRINDA\s+/i, /^MOUNTAIN DEW\s+/i,
  /^DEW\s+/i, /^SLICE\s+/i, /^STING\s+/i, /^RED BULL\s+/i, /^REDBULL\s+/i, /^AQUAFINA\s+/i,
  /^NESTLE\s+/i, /^DAIRY MILK\s+/i, /^CADBURY\s+/i, /^KITKAT\s+/i, /^TAPAL\s+/i, /^VITAL\s+/i,
  /^LAYS\s+/i, /^KURKURE\s+/i, /^DORITOS\s+/i, /^CHEETOS\s+/i, /^OREO\s+/i, /^SOOPER\s+/i,
  /^MARIE\s+/i, /^RIFFLE\s+/i, /^PEPSODENT\s+/i, /^COLGATE\s+/i, /^SUNSILK\s+/i, /^DOVE\s+/i,
  /^LUX\s+/i, /^ lifebuoy\s+/i, /^DETTOL\s+/i, /^HARPIC\s+/i, /^SURF\s+EXCEL\s+/i, /^ARIEL\s+/i,
  /^TIDE\s+/i, /^ALMARWAH\s+/i, /^MEZAN\s+/i,
];

function parseProductName(productName) {
  let name = productName.trim();
  let baseProduct = name;
  let sizeValue = null;
  let sizeUnit = null;
  let sizeDisplay = null;

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

      for (const [unit, multiplier] of Object.entries(UNIT_CONVERSIONS)) {
        if (rawUnit.toUpperCase().includes(unit)) {
          sizeUnit = unit.toLowerCase();
          sizeDisplay = match[0].toUpperCase();

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
        baseProduct = name.replace(match[0], '').trim();
        break;
      }
    }
  }

  baseProduct = baseProduct
    .replace(/\s+(BOTTLE|TIN|BOX|PACK|PAK|POUCH|JAR|BAG|BARS|SACHET|IMP|LOCAL|BP|PET|GLASS)\b.*$/i, '')
    .trim();

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

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Update Product Normalization                        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Fetch all products
    console.log('📊 Fetching all products...');
    const products = await supabaseFetch('products?select=id,name&limit=1000');
    console.log(`✅ Found ${products.length} products\n`);

    // 2. Update each product
    console.log('💾 Updating products with normalization data...');
    let success = 0;
    let failed = 0;

    for (const product of products) {
      try {
        const parsed = parseProductName(product.name);

        await supabaseFetch(`products?id=eq.${product.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            base_product_name: parsed.baseProduct,
            brand_name: parsed.brand || '',
            size_value: parsed.sizeValue,
            size_unit: parsed.sizeUnit || '',
            size_display: parsed.sizeDisplay,
          }),
        });

        success++;
        if (success % 100 === 0) {
          console.log(`   Progress: ${success}/${products.length}...`);
        }
      } catch (error) {
        failed++;
        console.error(`   ❌ Failed to update "${product.name}": ${error.message}`);
      }
    }

    console.log(`\n✅ Successfully updated: ${success} products`);
    if (failed > 0) {
      console.log(`❌ Failed to update: ${failed} products`);
    }

    // 3. Show summary
    console.log('\n📊 Normalization summary:');
    const updatedProducts = await supabaseFetch('products?select=base_product_name,brand_name,size_value,size_unit&limit=1000');

    const baseProducts = {};
    updatedProducts.forEach(p => {
      if (p.base_product_name) {
        const key = p.base_product_name;
        if (!baseProducts[key]) {
          baseProducts[key] = { count: 0, sizes: {} };
        }
        baseProducts[key].count++;
        if (p.size_value && p.size_unit) {
          const sizeKey = `${p.size_value} ${p.size_unit}`;
          baseProducts[key].sizes[sizeKey] = true;
        }
      }
    });

    console.log(`   Total base products: ${Object.keys(baseProducts).length}`);
    console.log(`   Products with base name: ${updatedProducts.filter(p => p.base_product_name).length}`);
    console.log(`   Products with brand: ${updatedProducts.filter(p => p.brand_name).length}`);
    console.log(`   Products with size: ${updatedProducts.filter(p => p.size_value).length}`);

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  Update Complete!                                       ║');
    console.log('╚══════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
