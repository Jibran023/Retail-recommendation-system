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
