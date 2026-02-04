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
    // Mock empty response
    await page.route('**/rest/v1/products*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await searchPage.search('Nonexistent Product');
    await page.waitForTimeout(1000);

    // Check for no results message
    const noResults = page.locator('[data-testid="no-results"]');
    await expect(noResults).toBeVisible();
  });
});
