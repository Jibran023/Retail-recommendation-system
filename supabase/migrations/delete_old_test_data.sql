-- Delete old test products and their prices
-- This removes the mock data that was inserted before we started using the API

-- Delete prices for old test products first (foreign key constraint)
DELETE FROM prices WHERE product_id IN ('1', '2', '3');

-- Delete the old test products
DELETE FROM products WHERE id IN ('1', '2', '3');

-- Verify deletion
-- These categories should now be empty or only contain real API data
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category
ORDER BY category;
