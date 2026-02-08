-- Migration: Update store IDs and data to match application configuration
-- This updates the stores table to use string IDs (imtiaz, bin-hashim, chase-plus, al-jadeed)

-- Drop foreign key constraints that reference stores.id
ALTER TABLE prices DROP CONSTRAINT IF EXISTS prices_store_id_fkey;
ALTER TABLE scraping_logs DROP CONSTRAINT IF EXISTS scraping_logs_store_id_fkey;

-- IMPORTANT: Update existing prices to use new store IDs BEFORE updating stores
UPDATE prices SET store_id = 'imtiaz' WHERE store_id = '1';
UPDATE prices SET store_id = 'chase-plus' WHERE store_id = '2';
UPDATE prices SET store_id = 'bin-hashim' WHERE store_id = '3';

-- Update scraping_logs as well (if there's any data)
UPDATE scraping_logs SET store_id = 'imtiaz' WHERE store_id = '1';
UPDATE scraping_logs SET store_id = 'chase-plus' WHERE store_id = '2';
UPDATE scraping_logs SET store_id = 'bin-hashim' WHERE store_id = '3';

-- Now update the stores table
UPDATE stores SET
  id = 'imtiaz',
  slug = 'imtiaz',
  website_url = 'https://shop.imtiaz.com.pk',
  address = 'Main University Rd, Block 7 Gulshan-e-Iqbal',
  area = 'Gulshan-e-Iqbal',
  phone = '+92 21 34324143',
  latitude = '24.9326',
  longitude = '67.1041'
WHERE id = '1';

UPDATE stores SET
  id = 'chase-plus',
  name = 'Chase Up',
  website_url = 'https://chaseup.com.pk',
  address = 'Shop # G-1, G-2, Creek Club, Main Clifton Rd',
  phone = '+92 21 35831371',
  latitude = '24.8014',
  longitude = '67.0316'
WHERE id = '2';

UPDATE stores SET
  id = 'bin-hashim',
  website_url = 'https://binhashimonline.pk',
  address = 'Main Shahrah-e-Pakistan',
  area = 'North Nazimabad',
  phone = '+92 21 36612020',
  latitude = '24.9397',
  longitude = '67.0619'
WHERE id = '3';

-- Insert Al-Jadeed store (new store with public API)
INSERT INTO stores (id, name, slug, website_url, address, area, city, phone, latitude, longitude)
VALUES (
  'al-jadeed',
  'Al-Jadeed',
  'al-jadeed',
  'https://www.aljadeed.pk',
  'Main Shahrah-e-Pakistan',
  'North Nazimabad',
  'Karachi',
  '+92 21 36612020',
  '24.9350',
  '67.0680'
)
ON CONFLICT (id) DO NOTHING;

-- Re-add foreign key constraints
ALTER TABLE prices
  ADD CONSTRAINT prices_store_id_fkey
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

ALTER TABLE scraping_logs
  ADD CONSTRAINT scraping_logs_store_id_fkey
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
