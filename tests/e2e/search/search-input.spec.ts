import { test, expect } from '../../support/fixtures';
import { SearchPage } from '../../support/page-objects';
import { ProductFactory } from '../../support/fixtures/factories/product-factory';

/**
 * Search Input Tests
 *
 * Tests the search input field functionality
 */

test.describe('Search Input', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('should display search input on page load', async ({ page }) => {
    await expect(searchPage.searchInput).toBeVisible();
    await expect(searchPage.searchInput).toBeEnabled();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    const searchInput = searchPage.searchInput;

    // Check aria-label
    await expect(searchInput).toHaveAttribute('aria-label', 'Search products');

    // Check placeholder
    await expect(searchInput).toHaveAttribute('placeholder', /Search products/i);
  });

  test('should allow typing in search input', async ({ page }) => {
    const query = 'Cooking Oil';
    await searchPage.searchInput.fill(query);
    const value = await searchPage.getSearchValue();
    expect(value).toBe(query);
  });

  test('should clear search input', async ({ page }) => {
    await searchPage.searchInput.fill('Test');
    await searchPage.clearSearch();
    const value = await searchPage.getSearchValue();
    expect(value).toBe('');
  });
});
