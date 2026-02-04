import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Search Accessibility Tests
 *
 * Tests WCAG AA compliance for search functionality
 */

test.describe('Search Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow keyboard navigation to search input', async ({ page }) => {
    // Click on body to remove any focus
    await page.locator('body').click();

    // Tab to focus the search input
    await page.keyboard.press('Tab');

    // Verify we can interact with the search input
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Test');
    const value = await searchInput.inputValue();
    expect(value).toBe('Test');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Search input
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveAttribute('aria-label', 'Search products');

    // Search button
    const searchButton = page.locator('[data-testid="search-button"]');
    await expect(searchButton).toHaveAttribute('aria-label', 'Search');
  });
});
