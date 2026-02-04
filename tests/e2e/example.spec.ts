import { test, expect } from '@playwright/test';

/**
 * Example Test - Basic Setup Verification
 *
 * This test verifies that Playwright is properly configured
 * and can interact with the application.
 */

test.describe('Application Setup', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Retail Recommendation/i);

    // Check that the page loaded successfully
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper viewport for mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify responsive layout
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have proper viewport for desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Verify responsive layout
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
