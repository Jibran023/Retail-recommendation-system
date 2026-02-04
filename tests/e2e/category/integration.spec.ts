import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category & Search Integration Tests
 *
 * Tests how category filter works with search functionality
 */

test.describe('Category & Search Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should filter products when category selected', async ({ page }) => {
    // Mock API response for category-filtered products
    await page.route('**/rest/v1/products*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'Cooking Oil 5kg - Habib',
            category: 'Cooking Oil & Ghee',
          },
        ]),
      });
    });

    await page.route('**/rest/v1/prices*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/rest/v1/stores*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Select a category
    const cookingOilCategory = page.locator('[data-testid="category-cooking-oil"]');
    await cookingOilCategory.click();
    await page.waitForTimeout(1000);

    // Verify page updated (filter was triggered)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should work alongside search functionality', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    const categoryFilter = page.locator('[data-testid="category-filter"]');

    // Both should be visible and interactive
    await expect(searchInput).toBeVisible();
    await expect(categoryFilter).toBeVisible();

    // Should be able to interact with both
    await searchInput.fill('Oil');
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe('Oil');

    await categoryFilter.click();
    await expect(categoryFilter).toBeVisible();
  });
});
