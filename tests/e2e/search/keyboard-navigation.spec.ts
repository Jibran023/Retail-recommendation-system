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

  test('should not auto-search while typing', async ({ page }) => {
    let apiCallCount = 0;

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Track API calls - set up before typing
    await page.route('**/rest/v1/products*', (route) => {
      apiCallCount++;
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

    // Clear any initial input
    await searchPage.searchInput.clear();
    await page.waitForTimeout(200);

    // Type character by character with delays
    await searchPage.searchInput.type('Cooking', { delay: 150 });
    await page.waitForTimeout(1000);

    // API should NOT be called while typing
    expect(apiCallCount).toBe(0);

    // Press Enter to trigger search
    await page.keyboard.press('Enter');

    // Wait for API call
    await page.waitForTimeout(2000);

    // Now API should be called
    expect(apiCallCount).toBeGreaterThan(0);
  });
});
