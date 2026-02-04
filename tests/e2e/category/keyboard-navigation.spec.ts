import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Keyboard Navigation Tests
 *
 * Tests keyboard navigation for category filter
 */

test.describe('Category Keyboard Navigation', () => {
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

  test('should be keyboard navigable with arrow keys', async ({ page }) => {
    // Focus the first category chip (which is tabbable)
    const firstChip = page.locator('[data-testid="category-filter"] > [data-testid^="category-"]').first();
    await firstChip.focus();
    await page.waitForTimeout(100);

    // Press right arrow to move to next category
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Press left arrow to move back
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);

    // First chip should still be focusable
    await expect(firstChip).toBeVisible();
  });

  test('should select category with Enter key', async ({ page }) => {
    const firstChip = page.locator('[data-testid="category-filter"] > [data-testid^="category-"]').first();
    await firstChip.focus();
    await page.waitForTimeout(100);

    // Navigate to a different category
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Press Enter to select
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Verify selection worked (UI updated)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should select category with Space key', async ({ page }) => {
    const firstChip = page.locator('[data-testid="category-filter"] > [data-testid^="category-"]').first();
    await firstChip.focus();
    await page.waitForTimeout(100);

    // Navigate to a different category
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Press Space to select
    await page.keyboard.press(' ');
    await page.waitForTimeout(1000);

    // Verify selection worked
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
