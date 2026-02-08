-- Category Reclassification
-- Moves products from generic "Grocery Products" into specific categories
-- Based on product name keyword analysis

-- Update BEVERAGES (83 products)
-- Products containing: drink, juice, beverage, soft drink, soda, pepsi, coke, 7up, sprite, fanta, mountain dew, mirinda, sting, aquafina, nestle, water, energy drink, malt, squash, syrup
UPDATE products
SET category = 'Beverages'
WHERE category = 'Grocery Products'
  AND (
    LOWER(name) LIKE '%drink%' OR
    LOWER(name) LIKE '%juice%' OR
    LOWER(name) LIKE '%beverage%' OR
    LOWER(name) LIKE '%soft drink%' OR
    LOWER(name) LIKE '%soda%' OR
    LOWER(name) LIKE '%pepsi%' OR
    LOWER(name) LIKE '%coke%' OR
    LOWER(name) LIKE '%coca cola%' OR
    LOWER(name) LIKE '%7up%' OR
    LOWER(name) LIKE '%7-up%' OR
    LOWER(name) LIKE '%sprite%' OR
    LOWER(name) LIKE '%fanta%' OR
    LOWER(name) LIKE '%mountain dew%' OR
    LOWER(name) LIKE '%mirinda%' OR
    LOWER(name) LIKE '%sting%' OR
    LOWER(name) LIKE '%aquafina%' OR
    LOWER(name) LIKE '%nestle%' OR
    LOWER(name) LIKE '%water%' OR
    LOWER(name) LIKE '%energy drink%' OR
    LOWER(name) LIKE '%malt%' OR
    LOWER(name) LIKE '%squash%' OR
    LOWER(name) LIKE '%syrup%'
  );

-- Update COOKING OIL & GHEE (71 products)
-- Products containing: oil, ghee, banaspati, cooking oil, sunflower, canola, corn oil, olive oil, mustard oil
UPDATE products
SET category = 'Cooking Oil & Ghee'
WHERE category = 'Grocery Products'
  AND (
    LOWER(name) LIKE '%oil%' OR
    LOWER(name) LIKE '%ghee%' OR
    LOWER(name) LIKE '%banaspati%' OR
    LOWER(name) LIKE '%cooking oil%' OR
    LOWER(name) LIKE '%sunflower%' OR
    LOWER(name) LIKE '%canola%' OR
    LOWER(name) LIKE '%corn oil%' OR
    LOWER(name) LIKE '%olive oil%' OR
    LOWER(name) LIKE '%mustard oil%'
  );

-- Update SPICES & MASALAS (78 products)
-- Products containing: masala, spice, chili, mirch, turmeric, cumin, coriander, pepper, salt, sugar, ginger, garlic, onion
UPDATE products
SET category = 'Spices & Masalas'
WHERE category = 'Grocery Products'
  AND (
    LOWER(name) LIKE '%masala%' OR
    LOWER(name) LIKE '%spice%' OR
    LOWER(name) LIKE '%chili%' OR
    LOWER(name) LIKE '%mirch%' OR
    LOWER(name) LIKE '%turmeric%' OR
    LOWER(name) LIKE '%cumin%' OR
    LOWER(name) LIKE '%coriander%' OR
    LOWER(name) LIKE '%pepper%' OR
    LOWER(name) LIKE '%salt%' OR
    LOWER(name) LIKE '%sugar%' OR
    LOWER(name) LIKE '%ginger%' OR
    LOWER(name) LIKE '%garlic%' OR
    LOWER(name) LIKE '%onion%'
  );

-- Update SNACKS & CONFECTIONARY (69 products)
-- Products containing: biscuit, cookie, wafer, cake, rusk, chocolate, candy, snack, chips, crisp, bakery, bread, bun, roll, pastry, confectionery, sweets, dessert, pudding, jelly, jam, honey
UPDATE products
SET category = 'Snacks & Confectionary'
WHERE category = 'Grocery Products'
  AND (
    LOWER(name) LIKE '%biscuit%' OR
    LOWER(name) LIKE '%cookie%' OR
    LOWER(name) LIKE '%wafer%' OR
    LOWER(name) LIKE '%cake%' OR
    LOWER(name) LIKE '%rusk%' OR
    LOWER(name) LIKE '%chocolate%' OR
    LOWER(name) LIKE '%candy%' OR
    LOWER(name) LIKE '%snack%' OR
    LOWER(name) LIKE '%chips%' OR
    LOWER(name) LIKE '%crisp%' OR
    LOWER(name) LIKE '%bakery%' OR
    LOWER(name) LIKE '%bread%' OR
    LOWER(name) LIKE '%bun%' OR
    LOWER(name) LIKE '%roll%' OR
    LOWER(name) LIKE '%pastry%' OR
    LOWER(name) LIKE '%confectionery%' OR
    LOWER(name) LIKE '%sweets%' OR
    LOWER(name) LIKE '%dessert%' OR
    LOWER(name) LIKE '%pudding%' OR
    LOWER(name) LIKE '%jelly%' OR
    LOWER(name) LIKE '%jam%' OR
    LOWER(name) LIKE '%honey%'
  );

-- Update TEA & COFFEE (4 products)
-- Products containing: tea, coffee, green tea, black tea, herbal tea, instant coffee, nescafe, tapal, lipton, vital, chai, caffe, milo
UPDATE products
SET category = 'Tea & Coffee'
WHERE category = 'Grocery Products'
  AND (
    LOWER(name) LIKE '%tea%' OR
    LOWER(name) LIKE '%coffee%' OR
    LOWER(name) LIKE '%green tea%' OR
    LOWER(name) LIKE '%black tea%' OR
    LOWER(name) LIKE '%herbal tea%' OR
    LOWER(name) LIKE '%instant coffee%' OR
    LOWER(name) LIKE '%nescafe%' OR
    LOWER(name) LIKE '%tapal%' OR
    LOWER(name) LIKE '%lipton%' OR
    LOWER(name) LIKE '%vital%' OR
    LOWER(name) LIKE '%chai%' OR
    LOWER(name) LIKE '%caffe%' OR
    LOWER(name) LIKE '%milo%'
  );

-- Update RICE & GRAINS (13 products)
-- Products containing: rice, basmati, grain, flour, wheat, atta, maida, pulses, lentils, daal, beans, cereals
UPDATE products
SET category = 'Rice & Grains'
WHERE category = 'Grocery Products'
  AND (
    LOWER(name) LIKE '%rice%' OR
    LOWER(name) LIKE '%basmati%' OR
    LOWER(name) LIKE '%grain%' OR
    LOWER(name) LIKE '%flour%' OR
    LOWER(name) LIKE '%wheat%' OR
    LOWER(name) LIKE '%atta%' OR
    LOWER(name) LIKE '%maida%' OR
    LOWER(name) LIKE '%pulses%' OR
    LOWER(name) LIKE '%lentils%' OR
    LOWER(name) LIKE '%daal%' OR
    LOWER(name) LIKE '%beans%' OR
    LOWER(name) LIKE '%cereals%'
  );

-- Update DAIRY & EGGS (2 products)
-- Products containing: milk powder, fresh milk, cream, butter, cheese, yogurt, eggs, dairy, condensed milk, evaporated milk
UPDATE products
SET category = 'Dairy & Eggs'
WHERE category = 'Grocery Products'
  AND (
    LOWER(name) LIKE '%milk powder%' OR
    LOWER(name) LIKE '%fresh milk%' OR
    LOWER(name) LIKE '%cream%' OR
    LOWER(name) LIKE '%butter%' OR
    LOWER(name) LIKE '%cheese%' OR
    LOWER(name) LIKE '%yogurt%' OR
    LOWER(name) LIKE '%eggs%' OR
    LOWER(name) LIKE '%dairy%' OR
    LOWER(name) LIKE '%condensed milk%' OR
    LOWER(name) LIKE '%evaporated milk%'
  );

-- Verify the changes
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
ORDER BY count DESC;
