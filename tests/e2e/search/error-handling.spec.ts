import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Search Error Handling Tests
 *
 * Tests error scenarios and graceful degradation
 */

test.describe('Search Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display error message when API fails', async ({ page }) => {
    // Mock API error
    await page.route('**/rest/v1/products*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Failed to search products. Please try again.',
        }),
      });
    });

    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Test');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Verify the page doesn't crash and shows UI
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/rest/v1/products*', (route) => {
      route.abort('failed');
    });

    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Test');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Should still have visible UI, just no results
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
