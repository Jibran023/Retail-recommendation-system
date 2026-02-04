import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Accessibility Tests
 *
 * Tests WCAG AA compliance for category filter
 */

test.describe('Category Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]');

    // Check role
    await expect(categoryFilter).toHaveAttribute('role', 'tablist');

    // Check aria-label
    await expect(categoryFilter).toHaveAttribute('aria-label', 'Product categories');
  });

  test('category chips should have proper ARIA attributes', async ({ page }) => {
    // Get first category chip, excluding the filter container
    const firstChip = page.locator('[data-testid="category-filter"] > [data-testid^="category-"]').first();

    // Check role
    await expect(firstChip).toHaveAttribute('role', 'tab');

    // Check aria-selected is boolean
    const ariaSelected = await firstChip.getAttribute('aria-selected');
    expect(['true', 'false']).toContain(ariaSelected);

    // Check aria-label exists
    const ariaLabel = await firstChip.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should support screen reader navigation', async ({ page }) => {
    const allCategory = page.locator('[data-testid="category-all"]');

    // Check it has accessible name
    const ariaLabel = await allCategory.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();

    // Check tab index for keyboard navigation
    const tabIndex = await allCategory.getAttribute('tabIndex');
    expect(tabIndex).toBe('0'); // First item should be tabbable
  });
});
