import { test, expect } from '../../support/fixtures';
import { Page } from '@playwright/test';

/**
 * Category Visual States Tests
 *
 * Tests visual feedback for different states
 */

test.describe('Category Visual States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show hover effect on category', async ({ page }) => {
    const category = page.locator('[data-testid="category-cooking-oil"]');

    // Hover over category
    await category.hover();

    // Check for visual change (transform scale or background color)
    const transform = await category.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    // Should have some transform (hover effect)
    expect(transform).not.toBe('none');
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

  test('should display inactive category with border', async ({ page }) => {
    const category = page.locator('[data-testid="category-cooking-oil"]');

    // Get border width of inactive category
    const borderWidth = await category.evaluate((el) => {
      return window.getComputedStyle(el).borderLeftWidth;
    });

    // Inactive category should have border
    expect(borderWidth).not.toBe('0px');
  });
});
