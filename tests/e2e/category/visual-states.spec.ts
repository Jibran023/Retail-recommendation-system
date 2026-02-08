import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Visual States Tests
 *
 * Tests visual feedback for different states
 */

test.describe('Category Visual States', () => {
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
  });

  test('should show focused state with outline', async ({ page }) => {
    const category = page.locator('[data-testid="category-all"]');
    await category.focus();

    // Check for focus outline
    const outline = await category.evaluate((el) => {
      return window.getComputedStyle(el).outline;
    });

    // Focused element should have visible outline
    expect(outline).not.toBe('none');
  });

  test('should display active category with filled background', async ({ page }) => {
    const allCategory = page.locator('[data-testid="category-all"]');

    // Get background color of active category
    const backgroundColor = await allCategory.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Active category should have colored background (not transparent)
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
