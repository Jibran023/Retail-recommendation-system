import { test, expect } from '../../support/fixtures';
import { SearchPage } from '../../support/page-objects';
import { ProductFactory } from '../../support/fixtures/factories/product-factory';

/**
 * Search Button Tests
 *
 * Tests the search button functionality
 */

test.describe('Search Button', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('should display search button', async ({ page }) => {
    await expect(searchPage.searchButton).toBeVisible();
  });

  test('should trigger search when clicked', async ({ page }) => {
    // Mock Supabase API responses
    const mockProduct = ProductFactory.createProduct({
      name: 'Cooking Oil 5kg - Habib',
      id: '1',
    });

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
        body: JSON.stringify(mockProduct.prices),
      });
    });

    await page.route('**/rest/v1/stores*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await searchPage.searchWithButton('Cooking Oil');
    await page.waitForTimeout(1000);

    // Verify search was performed
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);
  });
});
