/**
 * Test Helper Utilities
 *
 * Common utility functions used across E2E tests.
 */

import { Page, Locator } from '@playwright/test';

/**
 * Wait for API response to complete
 * Useful for ensuring data is loaded before asserting
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 30000
) {
  return await page.waitForResponse(
    (response) =>
      response.url().includes(urlPattern) || response.url().match(urlPattern),
    { timeout }
  );
}

/**
 * Clear text input and type new value
 */
export async function clearAndType(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  const element = page.locator(selector);
  await element.click();
  await element.fill(''); // Clear existing text
  await element.type(text);
}

/**
 * Get element text content
 */
export async function getElementText(
  page: Page,
  selector: string
): Promise<string> {
  const element = page.locator(selector);
  await element.waitFor();
  return await element.textContent() || '';
}

/**
 * Wait for element to be visible and enabled
 */
export async function waitForElementEnabled(
  page: Page,
  selector: string,
  timeout: number = 5000
): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
  // Also wait for it to be enabled
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      return el && !(el as HTMLInputElement).disabled;
    },
    selector,
    { timeout }
  );
}

/**
 * Check if element exists
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  const count = await element.count();
  return count > 0;
}

/**
 * Format price from cents to display string
 */
export function formatPrice(cents: number): string {
  const rupees = cents / 100;
  return `Rs. ${rupees.toLocaleString('en-PK')}`;
}

/**
 * Parse price string to cents
 */
export function parsePriceToCents(priceString: string): number {
  // Remove "Rs. ", commas, and convert to cents
  const numericString = priceString
    .replace('Rs. ', '')
    .replace(/,/g, '')
    .trim();
  return Math.round(parseFloat(numericString) * 100);
}

/**
 * Mock API response (for testing without real backend)
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  responseData: any
): Promise<void> {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}

/**
 * Take screenshot on failure
 */
export async function takeScreenshot(
  page: Page,
  testName: string
): Promise<void> {
  await page.screenshot({
    path: `test-results/screenshots/${testName}.png`,
    fullPage: true,
  });
}

/**
 * Get data-testid selector
 */
export function getByTestId(testId: string): string {
  return `[data-testid="${testId}"]`;
}

/**
 * Wait for loading spinner to disappear
 */
export async function waitForLoadingToFinish(
  page: Page,
  selector: string = '[data-testid="loading-spinner"]',
  timeout: number = 15000
): Promise<void> {
  try {
    const loader = page.locator(selector);
    await loader.waitFor({ state: 'hidden', timeout });
  } catch (error) {
    // If loader doesn't exist, that's fine - it might have finished quickly
    console.log('Loading selector not found or already hidden:', selector);
  }
}
