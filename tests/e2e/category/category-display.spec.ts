import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Filter Display Tests
 *
 * Tests the visual layout and display of category chips
 */

test.describe('Category Filter Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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
