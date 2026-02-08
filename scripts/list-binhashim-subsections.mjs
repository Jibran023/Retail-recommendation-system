#!/usr/bin/env node
/**
 * List Bin Hashim Sub-sections
 *
 * Fetches and displays all sub-sections within "Grocery Products" category
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const BIN_HASHIM_CONFIG = {
  baseUrl: 'https://binhashimonline.pk',
  restId: '55248',
  restBrId: '55203',
  appName: 'binhashimpharmacysupermarket',
};

/**
 * Fetch from Bin Hashim API
 */
async function binHashimFetch(endpoint) {
  const url = `${BIN_HASHIM_CONFIG.baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'App-name': BIN_HASHIM_CONFIG.appName,
      'Rest-Id': BIN_HASHIM_CONFIG.restId,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Referer': BIN_HASHIM_CONFIG.baseUrl,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Main function
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Bin Hashim Sub-sections Explorer                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Fetch menu sections (categories)
    console.log('📂 Fetching categories...');
    const menuResponse = await binHashimFetch('/api/menu-section?restId=55248&rest_brId=55203&delivery_type=0&source=google');

    if (!menuResponse.data || menuResponse.data.length === 0) {
      console.log('❌ No categories found');
      return;
    }

    console.log(`✅ Found ${menuResponse.data.length} categories\n`);

    // 2. Find "Grocery Products" category
    const groceryCategory = menuResponse.data.find(cat => cat.name === 'Grocery Products');

    if (!groceryCategory) {
      console.log('❌ "Grocery Products" category not found');
      return;
    }

    console.log(`📦 Category: "${groceryCategory.name}" (ID: ${groceryCategory.id})`);

    if (!groceryCategory.section || groceryCategory.section.length === 0) {
      console.log('❌ No sections found');
      return;
    }

    // 3. Get the first section (should be "Grocery Products")
    const grocerySection = groceryCategory.section[0];
    console.log(`   📋 Section: "${grocerySection.name}" (ID: ${grocerySection.id})\n`);

    // 4. Fetch sub-sections
    console.log('   Fetching sub-sections...');
    const subSectionsResponse = await binHashimFetch(
      `/api/dish-sub-section?menuId=${groceryCategory.id}&sectionId=${grocerySection.id}&restId=55248&rest_brId=55203&delivery_type=0&source=google`
    );

    if (!subSectionsResponse.data || !Array.isArray(subSectionsResponse.data) || subSectionsResponse.data.length === 0) {
      console.log('❌ No sub-sections data found');
      return;
    }

    const firstSection = subSectionsResponse.data[0];
    if (!firstSection.dish_sub_sections || firstSection.dish_sub_sections.length === 0) {
      console.log('❌ No dish_sub_sections found');
      return;
    }

    const subSections = firstSection.dish_sub_sections;

    console.log(`✅ Found ${subSections.length} sub-sections\n`);
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  Sub-sections within "Grocery Products"                ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    // Group by keyword patterns for our categories
    const categoryGroups = {
      'Tea & Coffee': [],
      'Beverages': [],
      'Cooking Oil & Ghee': [],
      'Rice & Grains': [],
      'Dairy & Eggs': [],
      'Snacks & Confectionary': [],
      'Spices & Masalas': [],
      'Other': []
    };

    // Display and categorize
    subSections.forEach((subSection, index) => {
      const name = subSection.name.toLowerCase();
      let category = 'Other';

      if (name.includes('tea') || name.includes('coffee')) category = 'Tea & Coffee';
      else if (name.includes('beverage') || name.includes('drink') || name.includes('juice') || name.includes('squash') || name.includes('syrup')) category = 'Beverages';
      else if (name.includes('oil') || name.includes('ghee')) category = 'Cooking Oil & Ghee';
      else if (name.includes('rice') || name.includes('flour') || name.includes('atta') || name.includes('grain') || name.includes('daal') || name.includes('pasta') || name.includes('noodle')) category = 'Rice & Grains';
      else if (name.includes('milk') || name.includes('dairy') || name.includes('cream') || name.includes('butter') || name.includes('cheese') || name.includes('egg')) category = 'Dairy & Eggs';
      else if (name.includes('biscuit') || name.includes('cookie') || name.includes('chocolate') || name.includes('confection') || name.includes('sweet')) category = 'Snacks & Confectionary';
      else if (name.includes('spice') || name.includes('masala') || name.includes('chili') || name.includes('salt') || name.includes('sugar')) category = 'Spices & Masalas';

      categoryGroups[category].push({
        id: subSection.id,
        name: subSection.name,
        priority: subSection.priority || 999
      });
    });

    // Display by groups
    Object.entries(categoryGroups).forEach(([category, subsections]) => {
      if (subsections.length === 0) return;
      console.log(`\n📦 ${category} (${subsections.length} sub-sections):`);
      subsections
        .sort((a, b) => a.priority - b.priority)
        .forEach(sub => {
          console.log(`   [${sub.id}] ${sub.name}`);
        });
    });

    console.log(`\n╔══════════════════════════════════════════════════════════╗`);
    console.log(`║  Total: ${subSections.length} sub-sections                             ║`);
    console.log('╚══════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
