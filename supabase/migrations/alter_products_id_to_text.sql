-- Migration: Change all id columns from bigint to text
-- This allows us to use composite IDs like "imtiaz_368016" and string store IDs

-- Drop all foreign key constraints that reference stores.id, products.id
ALTER TABLE prices DROP CONSTRAINT IF EXISTS prices_product_id_fkey;
ALTER TABLE prices DROP CONSTRAINT IF EXISTS prices_store_id_fkey;
ALTER TABLE scraping_logs DROP CONSTRAINT IF EXISTS scraping_logs_store_id_fkey;

-- Change the stores id column to text FIRST (before other tables that reference it)
ALTER TABLE stores ALTER COLUMN id TYPE text USING id::text;

-- Change the products id column to text
ALTER TABLE products ALTER COLUMN id TYPE text USING id::text;

-- Change the prices columns to text
ALTER TABLE prices ALTER COLUMN product_id TYPE text USING product_id::text;
ALTER TABLE prices ALTER COLUMN store_id TYPE text USING store_id::text;

-- Change the scraping_logs store_id column to text
ALTER TABLE scraping_logs ALTER COLUMN store_id TYPE text USING store_id::text;

-- Re-add all foreign key constraints
ALTER TABLE prices
  ADD CONSTRAINT prices_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE prices
  ADD CONSTRAINT prices_store_id_fkey
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

ALTER TABLE scraping_logs
  ADD CONSTRAINT scraping_logs_store_id_fkey
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
