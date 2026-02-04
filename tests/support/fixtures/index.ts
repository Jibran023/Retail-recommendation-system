import { test as base } from '@playwright/test';

/**
 * Test Fixtures for Retail Recommendation System
 *
 * This file extends Playwright's base test with custom fixtures:
 * - Helper utilities
 * - Data factories
 * - Page objects
 *
 * Usage:
 *   import { test, expect } from './tests/support/fixtures';
 *
 *   test('my test', async ({ page, productFactory }) => {
 *     // test code here
 *   });
 */

// Type definitions for our fixtures
type TestFixtures = {
  // Add custom fixtures here as needed
  // Example: userFactory: UserFactory;
  // Example: apiHelper: ApiHelper;
};

// Extend the base test with our fixtures
export const test = base.extend<TestFixtures>({});

// Re-export expect from Playwright
export { expect } from '@playwright/test';
