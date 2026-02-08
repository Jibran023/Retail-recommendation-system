-- Retail Recommendation System - Supabase Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- ==========================================
-- TABLES
-- ==========================================

-- Stores table (reference data for stores)
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  website_url TEXT,
  address TEXT,
  area TEXT,
  city TEXT,
  phone TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prices table (current prices for products from each store)
CREATE TABLE IF NOT EXISTS prices (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL,
  availability BOOLEAN DEFAULT true,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, store_id)
);

-- Price history table (historical price tracking)
CREATE TABLE IF NOT EXISTS price_history (
  id BIGSERIAL PRIMARY KEY,
  price_id BIGINT NOT NULL REFERENCES prices(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL,
  availability BOOLEAN,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scraping log table (track API fetch operations)
CREATE TABLE IF NOT EXISTS scraping_log (
  id BIGSERIAL PRIMARY KEY,
  store_id TEXT REFERENCES stores(id) ON DELETE SET NULL,
  operation TEXT NOT NULL, -- 'fetch_categories', 'fetch_products', etc.
  status TEXT NOT NULL, -- 'success', 'failed', 'partial'
  products_fetched INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name_gin ON products USING gin(name gin_trgm_ops);

-- Prices indexes
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_store_id ON prices(store_id);
CREATE INDEX IF NOT EXISTS idx_prices_scraped_at ON prices(scraped_at);
CREATE INDEX IF NOT EXISTS idx_prices_product_store ON prices(product_id, store_id);
CREATE INDEX IF NOT EXISTS idx_prices_availability ON prices(availability);

-- Price history indexes
CREATE INDEX IF NOT EXISTS idx_price_history_price_id ON price_history(price_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON price_history USING (
  SELECT p.id
  FROM prices p
  WHERE p.id = price_history.price_id
);

-- Scraping log indexes
CREATE INDEX IF NOT EXISTS idx_scraping_log_store_id ON scraping_log(store_id);
CREATE INDEX IF NOT EXISTS idx_scraping_log_status ON scraping_log(status);
CREATE INDEX IF NOT EXISTS idx_scraping_log_started_at ON scraping_log(started_at);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prices_updated_at
    BEFORE UPDATE ON prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to archive price before update
CREATE OR REPLACE FUNCTION archive_price_before_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only archive if price or availability changed
    IF OLD.price_cents IS DISTINCT FROM NEW.price_cents
       OR OLD.availability IS DISTINCT FROM NEW.availability THEN
        INSERT INTO price_history (price_id, price_cents, availability, recorded_at)
        VALUES (OLD.id, OLD.price_cents, OLD.availability, OLD.scraped_at);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for price archiving
CREATE TRIGGER archive_price_on_update
    BEFORE UPDATE ON prices
    FOR EACH ROW
    EXECUTE FUNCTION archive_price_before_update();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_log ENABLE ROW LEVEL SECURITY;

-- Public read access (for MVP - no authentication)
CREATE POLICY "Allow public read access to stores"
    ON stores FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to products"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to prices"
    ON prices FOR SELECT
    USING (true);

-- Service role write access (for server-side operations)
-- These policies will be managed by Supabase service role key

-- ==========================================
-- SEED DATA - Stores
-- ==========================================

INSERT INTO stores (id, name, slug, website_url, address, area, city, phone, latitude, longitude) VALUES
('imtiaz', 'Imtiaz Supermarket', 'imtiaz', 'https://shop.imtiaz.com.pk', 'Main University Rd, Block 7 Gulshan-e-Iqbal', 'Gulshan-e-Iqbal', 'Karachi', '+92 21 34324143', 24.9326, 67.1041),
('bin-hashim', 'Bin Hashim', 'bin-hashim', 'https://binhashimonline.pk', 'Main Shahrah-e-Pakistan', 'North Nazimabad', 'Karachi', '+92 21 36612020', 24.9397, 67.0619),
('al-jadeed', 'Al-Jadeed', 'al-jadeed', 'https://www.aljadeed.pk', 'Main Shahrah-e-Pakistan', 'North Nazimabad', 'Karachi', '+92 21 36612020', 24.9350, 67.0680)
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- VIEWS
-- ==========================================

-- View for product search with prices
CREATE OR REPLACE VIEW products_with_prices AS
SELECT
    p.id,
    p.name,
    p.category,
    p.description,
    p.image_url,
    json_agg(
        json_build_object(
            'storeId', pr.store_id,
            'storeName', s.name,
            'price', pr.price_cents,
            'available', pr.availability,
            'lastUpdated', pr.scraped_at
        )
    ) FILTER (WHERE pr.id IS NOT NULL) AS prices,
    MAX(pr.scraped_at) AS latest_price_update
FROM products p
LEFT JOIN prices pr ON p.id = pr.product_id
LEFT JOIN stores s ON pr.store_id = s.id
GROUP BY p.id, p.name, p.category, p.description, p.image_url;

-- ==========================================
-- CLEANUP FUNCTIONS
-- ==========================================

-- Function to clean up old price history (older than 6 months)
CREATE OR REPLACE FUNCTION cleanup_old_price_history()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM price_history
    WHERE recorded_at < NOW() - INTERVAL '6 months';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- COMPLETION
-- ==========================================

-- Display setup complete message
DO $$
BEGIN
    RAISE NOTICE 'Database schema setup complete!';
    RAISE NOTICE 'Tables: stores, products, prices, price_history, scraping_log';
    RAISE NOTICE 'Indexes created for performance';
    RAISE NOTICE 'RLS policies configured';
    RAISE NOTICE 'Seed data: 3 stores inserted';
END $$;
