import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Filter Display Tests
 *
 * Tests the visual layout and display of category chips
 */

test.describe('Category Filter Display', () => {
  test.beforeEach(async ({ page }) => {
    // Mock categories API to return predictable test data
    await page.route('**/rest/v1/products*select=name,category*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { name: 'Product 1', category: 'Test Category 1' },
          { name: 'Product 2', category: 'Test Category 2' },
          { name: 'Product 3', category: 'Test Category 3' },
        ]),
      });
    });

    await page.goto('/');

    // Wait for categories to load
    await page.waitForSelector('[data-testid="category-all"]', { timeout: 5000 });
  });

  test('should display category filter on page load', async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await expect(categoryFilter).toBeVisible();
  });

  test('should display all category chips', async ({ page }) => {
    const categoryChips = page.locator('[data-testid="category-filter"] > [data-testid^="category-"]');
    const count = await categoryChips.count();

    // Should have multiple categories (at least "all" plus others)
    expect(count).toBeGreaterThan(1);
  });

  test('should have "All" category as first option', async ({ page }) => {
    const categoryChips = page.locator('[data-testid="category-filter"] > [data-testid^="category-"]');

    // Should have categories
    const count = await categoryChips.count();
    expect(count).toBeGreaterThan(0);

    // First chip should be "All"
    const firstChip = categoryChips.first();
    await expect(firstChip).toHaveAttribute('data-testid', 'category-all');
  });

  test('should be horizontally scrollable on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const categoryFilter = page.locator('[data-testid="category-filter"]');

    // Check if overflow-x is set (horizontal scroll)
    const overflowX = await categoryFilter.evaluate((el) => {
      return window.getComputedStyle(el).overflowX;
    });

    expect(overflowX).toBe('auto');
  });
});
