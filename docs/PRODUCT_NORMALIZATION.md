# Product Normalization System

## Overview

The product normalization system organizes products by their base name and size, making it easier to:
- Find all variants of the same product (e.g., all 7UP sizes)
- Compare prices across different sizes
- Group products by brand
- Filter products by size range

## How It Works

### 1. Product Parsing

The system extracts the following information from each product name:

- **Base Product Name**: The core product identifier (e.g., "7UP" from "7UP 1 LITRE BOTTLE")
- **Brand Name**: Detected brand (e.g., "TAPAL" from "TAPAL TEZDUM TEA 170GM")
- **Size Value**: Numeric size converted to standard units
- **Size Unit**: Standardized unit (ml for liquids, g for solids, pcs for pieces)
- **Size Display**: Original size string (e.g., "1 LITRE")

### 2. Size Normalization

All sizes are converted to standard base units:

| Original Unit | Converted To | Multiplier |
|--------------|--------------|------------|
| ML, MILLILITRES | ml | 1 |
| L, LITRE | ml | 1000 |
| GM, GRAMS | g | 1 |
| KG | g | 1000 |
| PCS, PIECES | pcs | 1 |

Examples:
- "500 ML" → 500 ml
- "1.5 LITRE" → 1500 ml
- "170 GM" → 170 g
- "1 KG" → 1000 g

### 3. Product Grouping

Products are grouped by:
- Base Product Name
- Category
- Brand (optional)

Within each group, products are organized by size.

## Setup Instructions

### Step 1: Add Database Columns

Run these SQL commands in Supabase SQL Editor:

```sql
-- Add normalization columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS base_product_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_value NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_unit TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_display TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_base_product_name ON products(base_product_name);
CREATE INDEX IF NOT EXISTS idx_products_brand_name ON products(brand_name);

-- Create view for grouped products
CREATE OR REPLACE VIEW product_variants AS
SELECT
  base_product_name,
  brand_name,
  category,
  COUNT(*) as variant_count,
  ARRAYAGG(id ORDER BY size_value) as product_ids,
  ARRAYAGG(name ORDER BY size_value) as product_names,
  ARRAYAGG(size_value ORDER BY size_value) as sizes,
  ARRAYAGG(size_unit ORDER BY size_value) as units
FROM products
WHERE base_product_name IS NOT NULL
GROUP BY base_product_name, brand_name, category;
```

### Step 2: Populate Normalization Data

```bash
npm run update-normalization
```

This will parse all product names and populate the normalization columns.

### Step 3: Verify Results

Check the database to verify products are normalized:

```sql
-- See all variants of a product
SELECT name, base_product_name, size_value, size_unit, size_display
FROM products
WHERE base_product_name = '7UP'
ORDER BY size_value;

-- Get product variant counts
SELECT base_product_name, category, COUNT(*) as variant_count
FROM products
WHERE base_product_name IS NOT NULL
GROUP BY base_product_name, category
ORDER BY variant_count DESC
LIMIT 20;
```

## Usage Examples

### Frontend Integration

```typescript
// Get all variants of a product
const { data: variants } = await supabase
  .from('products')
  .select('*')
  .eq('base_product_name', '7UP')
  .order('size_value');

// Filter products by size range
const { data: largeBeverages } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'Beverages')
  .gte('size_value', 1000)  // 1 liter or more
  .eq('size_unit', 'ml')
  .order('size_value');

// Group products by brand
const { data: tapalProducts } = await supabase
  .from('products')
  .select('*')
  .eq('brand_name', 'TAPAL')
  .order('base_product_name');
```

### Displaying Product Groups

```typescript
// Show all sizes of a product
function ProductVariantGroup({ baseName }) {
  const { data: variants } = useSupabaseQuery(
    supabase
      .from('products')
      .select('*')
      .eq('base_product_name', baseName)
      .order('size_value')
  );

  return (
    <div>
      <h3>{baseName}</h3>
      <ul>
        {variants?.map(v => (
          <li key={v.id}>
            {v.size_display} - PKR {v.prices[0].price_cents / 100}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Running Scripts

### Analyze Products (Dry Run)

```bash
npm run normalize-products
```

This shows how products will be parsed without updating the database.

### Update Database

```bash
npm run update-normalization
```

This populates all normalization columns in the database.

## Current Statistics

After normalization:
- **Total Products**: 785
- **Base Products**: 606
- **Average Variants per Product**: 1.3

Top product groups by variant count:
1. VITAL TEA - 12 variants (85g to 900g)
2. NESTLE JUICE - 10 variants
3. MEZAN TEA ULTRA RICH - 6 variants
4. TAPAL DANEDAR TEA - 6 variants
5. 7UP - 6 variants (250ml to 2250ml)

## Database Schema

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Unique product ID |
| `name` | TEXT | Full product name |
| `base_product_name` | TEXT | Normalized base name |
| `brand_name` | TEXT | Detected brand |
| `size_value` | NUMERIC | Size in standard units |
| `size_unit` | TEXT | Unit (ml, g, pcs) |
| `size_display` | TEXT | Original size string |
| `category` | TEXT | Product category |

### Product Variants View

| Column | Type | Description |
|--------|------|-------------|
| `base_product_name` | TEXT | Base product name |
| `brand_name` | TEXT | Brand name |
| `category` | TEXT | Product category |
| `variant_count` | INTEGER | Number of variants |
| `product_ids` | TEXT[] | Array of product IDs |
| `product_names` | TEXT[] | Array of product names |
| `sizes` | NUMERIC[] | Array of sizes |
| `units` | TEXT[] | Array of units |

## Notes

- Products are automatically parsed based on name patterns
- Manual adjustments may be needed for some products
- The system detects common brands automatically
- Size units are normalized for easy comparison
- Empty values are allowed for products that don't match patterns
