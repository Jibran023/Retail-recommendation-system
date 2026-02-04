import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Selection Tests
 *
 * Tests category selection behavior and state changes
 */

test.describe('Category Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Mock API responses
    await page.route('**/rest/v1/products*', (route) => {
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
    // Click on a different category
    const cookingOilCategory = page.locator('[data-testid="category-cooking-oil"]');
    await cookingOilCategory.click();
    await page.waitForTimeout(1000);

    // Verify it's now selected (has different background color)
    const backgroundColor = await cookingOilCategory.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Selected category should have colored background
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should select "All" category when clicked', async ({ page }) => {
    // First select a different category
    const cookingOilCategory = page.locator('[data-testid="category-cooking-oil"]');
    await cookingOilCategory.click();
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
