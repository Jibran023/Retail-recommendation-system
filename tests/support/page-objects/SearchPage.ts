/**
 * Search Page Object
 *
 * Encapsulates interactions with the search functionality.
 * Follows the Page Object Model pattern for maintainable tests.
 */

import { Page, Locator, expect } from '@playwright/test';
import { getByTestId, waitForLoadingToFinish, clearAndType } from '../helpers/test-helpers';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Search bar elements - using data-testid selectors
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    // Results elements - using data-testid selectors
    this.searchResults = page.locator('[data-testid="search-results"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  /**
   * Navigate to the home page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Search for a product by typing and pressing Enter
   */
  async search(query: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await waitForLoadingToFinish(this.page);
  }

  /**
   * Search by typing and clicking the search button
   */
  async searchWithButton(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await waitForLoadingToFinish(this.page);
  }

  /**
   * Clear the search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  /**
   * Get the current search input value
   */
  async getSearchValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  /**
   * Wait for search results to appear
   */
  async waitForResults(): Promise<void> {
    await this.searchResults.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get all product cards in search results
   */
  async getProductCards(): Promise<Locator[]> {
    await this.waitForResults();
    const cards = this.page.locator('[data-testid="product-card"]').all();
    return cards;
  }

  /**
   * Get the number of search results
   */
  async getResultCount(): Promise<number> {
    const cards = await this.getProductCards();
    return cards.length;
  }

  /**
   * Check if search results are displayed
   */
  async hasResults(): Promise<boolean> {
    const count = await this.page.locator('[data-testid="product-card"]').count();
    return count > 0;
  }

  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    const count = await this.errorMessage.count();
    return count > 0;
  }

  /**
   * Get error message text
   */
  async getErrorText(): Promise<string | null> {
    if (await this.hasError()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Click on a product by name
   */
  async clickProduct(productName: string): Promise<void> {
    const productCard = this.page.locator(`[data-testid="product-card"]:has-text("${productName}")`);
    await productCard.click();
  }

  /**
   * Verify search input is focused
   */
  async verifySearchInputFocused(): Promise<void> {
    await expect(this.searchInput).toBeFocused();
  }

  /**
   * Verify search input is enabled
   */
  async verifySearchInputEnabled(): Promise<void> {
    await expect(this.searchInput).toBeEnabled();
  }
}
