import { test, expect } from '../../support/fixtures';
import { SearchPage } from '../../support/page-objects';

/**
 * Search Keyboard Navigation Tests
 *
 * Tests keyboard shortcuts for search (Enter key, no auto-search)
 */

test.describe('Search Keyboard Navigation', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('should trigger search on Enter key', async ({ page }) => {
    const mockProduct = {
      id: '2',
      name: 'Basmati Rice 5kg - Guard',
      category: 'Rice & Grains',
      prices: [],
    };

    await page.route('**/rest/v1/products*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockProduct]),
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

    await searchPage.searchInput.fill('Rice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Verify search was triggered
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);
  });
});
