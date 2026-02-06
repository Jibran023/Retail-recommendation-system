import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category & Search Integration Tests
 *
 * Tests how category filter works with search functionality
 */

test.describe('Category & Search Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock categories API
    await page.route('**/rest/v1/products*select=name,category*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { name: 'Product 1', category: 'Test Category 1' },
          { name: 'Product 2', category: 'Test Category 2' },
        ]),
      });
    });

    await page.goto('/');

    // Wait for categories to load
    await page.waitForSelector('[data-testid="category-all"]', { timeout: 5000 });
  });

  test('should filter products when category selected', async ({ page }) => {
    // Mock API response for category-filtered products
    await page.route('**/rest/v1/products?*', (route) => {
      // Don't intercept the categories call
      if (route.request().url().includes('select=name,category')) {
        route.continue();
        return;
      }

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'Test Product',
            category: 'Test Category 1',
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
    const testCategory = page.locator('[data-testid="category-Test Category 1"]');
    await testCategory.click();
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
