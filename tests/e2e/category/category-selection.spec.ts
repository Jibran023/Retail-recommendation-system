import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Selection Tests
 *
 * Tests category selection behavior and state changes
 */

test.describe('Category Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Mock categories API
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

    // Mock other API responses
    await page.route('**/rest/v1/products?category=eq.*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
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

    await page.goto('/');

    // Wait for categories to load
    await page.waitForSelector('[data-testid="category-all"]', { timeout: 5000 });
  });

  test('should have "All" category selected by default', async ({ page }) => {
    const allCategory = page.locator('[data-testid="category-all"]');

    // Check background color indicates active state
    const backgroundColor = await allCategory.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Active category should have colored background (not transparent)
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should select category when clicked', async ({ page }) => {
    // Click on a different category (Test Category 1)
    const testCategory = page.locator('[data-testid="category-Test Category 1"]');
    await testCategory.click();
    await page.waitForTimeout(1000);

    // Verify it's now selected (has different background color)
    const backgroundColor = await testCategory.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Selected category should have colored background
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should select "All" category when clicked', async ({ page }) => {
    // First select a different category
    const testCategory = page.locator('[data-testid="category-Test Category 1"]');
    await testCategory.click();
    await page.waitForTimeout(500);

    // Then click back on "All"
    const allCategory = page.locator('[data-testid="category-all"]');
    await allCategory.click();
    await page.waitForTimeout(1000);

    // Verify "All" is selected again
    const backgroundColor = await allCategory.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
