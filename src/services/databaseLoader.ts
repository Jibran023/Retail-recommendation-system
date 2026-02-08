/**
 * Supabase Database Loader Service
 *
 * Loads transformed store data into Supabase using REST API
 * Follows the same pattern as supabaseClient.ts
 * Supports both Vite (browser) and Node.js environments
 */

/**
 * Get environment variable - works in both Vite and Node.js
 */
function getEnvVar(name: string): string | undefined {
  // Vite/browser environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name];
  }
  // Node.js environment (type-safe check)
  if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process?.env) {
    return (globalThis as any).process.env[name];
  }
  return undefined;
}

/**
 * Get Supabase credentials
 * Prefers service_role key for server-side operations (bypasses RLS)
 */
function getSupabaseConfig() {
  const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
  // Use service_role key for server-side operations (bypasses RLS)
  // Fall back to anon key if service_role not available
  const SUPABASE_KEY = getEnvVar('VITE_SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('VITE_SUPABASE_KEY');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_KEY)');
  }

  return { SUPABASE_URL, SUPABASE_KEY };
}

/**
 * Supabase REST API headers
 */
const getHeaders = (apiKey: string) => ({
  'apikey': apiKey,
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=ignore-duplicates,return=representation',
});

/**
 * Base fetch wrapper for Supabase REST API
 */
async function supabaseFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  apiKey: string,
  supabaseUrl: string
): Promise<T> {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(apiKey),
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
 * Upsert a product to Supabase
 */
export async function upsertProduct(productData: {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
}): Promise<boolean> {
  try {
    const { SUPABASE_URL, SUPABASE_KEY } = getSupabaseConfig();

    await supabaseFetch('products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }, SUPABASE_KEY, SUPABASE_URL);

    return true;
  } catch (error) {
    console.error(`[DB] Failed to upsert product ${productData.name}:`, error);
    return false;
  }
}

/**
 * Upsert a price to Supabase
 */
export async function upsertPrice(priceData: {
  product_id: string;
  store_id: string;
  price_cents: number;
  availability: boolean;
  scraped_at: string;
}): Promise<boolean> {
  try {
    const { SUPABASE_URL, SUPABASE_KEY } = getSupabaseConfig();

    await supabaseFetch('prices', {
      method: 'POST',
      body: JSON.stringify(priceData),
    }, SUPABASE_KEY, SUPABASE_URL);

    return true;
  } catch (error) {
    console.error(`[DB] Failed to upsert price for ${priceData.product_id}:`, error);
    return false;
  }
}

/**
 * Batch upsert products with their prices
 */
export async function batchUpsertProductsWithPrices(
  products: Array<{
    id: string;
    name: string;
    category: string;
    description?: string;
    image_url?: string;
    prices: Array<{
      store_id: string;
      price_cents: number;
      availability: boolean;
      scraped_at: string;
    }>;
}>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const product of products) {
    try {
      // 1. Upsert product (without prices)
      const { prices, ...productData } = product;
      const productSuccess = await upsertProduct(productData);
      if (!productSuccess) {
        failed++;
        continue;
      }

      // 2. Upsert prices for this product
      let productPricesSuccess = 0;
      for (const price of product.prices) {
        const priceSuccess = await upsertPrice({
          product_id: product.id,
          ...price,
        });

        if (priceSuccess) {
          success++;
          productPricesSuccess++;
        } else {
          failed++;
        }
      }

      console.log(`[DB] ✅ ${product.name}: ${productPricesSuccess} prices loaded`);

      // Small delay between products
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[DB] ❌ Failed to load product ${product.name}:`, error);
      failed++;
    }
  }

  console.log(`\n[DB] Summary: ${success} operations succeeded, ${failed} failed`);
  return { success, failed };
}
