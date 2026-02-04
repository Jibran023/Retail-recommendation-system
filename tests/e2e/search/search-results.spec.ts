import { test, expect } from '../../support/fixtures';
import { SearchPage } from '../../support/page-objects';

/**
 * Search Results Tests
 *
 * Tests the search results display functionality
 */

test.describe('Search Results', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('should display empty state initially', async ({ page }) => {
    const emptyState = page.locator('[data-testid="empty-state"]');
    await expect(emptyState).toBeVisible();
  });

  test('should show no results message when search returns empty', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Mock empty response for all endpoints
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

    // Perform search
    await searchPage.searchInput.click();
    await searchPage.searchInput.fill('Nonexistent Product');
    await page.keyboard.press('Enter');

    // Wait for search to complete and UI to update
    await page.waitForTimeout(2000);

    // Check for no results message
    const noResults = page.locator('[data-testid="no-results"]');
    await expect(noResults).toBeVisible({ timeout: 5000 });
  });
});
