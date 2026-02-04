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
});
