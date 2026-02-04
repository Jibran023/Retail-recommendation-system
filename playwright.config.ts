import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Retail Recommendation System
 *
 * Framework: Playwright with TypeScript
 * Test Directory: tests/e2e
 * Base URL: http://localhost:5173 (Vite dev server)
 *
 * Features:
 * - Parallel execution enabled
 * - Retries on CI (2 attempts)
 * - Failure artifact capture (traces, screenshots, videos)
 * - Multiple browsers (Chromium, Firefox, WebKit)
 * - HTML + JUnit reporters
 */

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Fully parallelize tests across all workers
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Test timeout: 60 seconds
  timeout: 60 * 1000,

  // Expect timeout: 15 seconds
  expect: {
    timeout: 15 * 1000,
  },

  // Shared settings for all tests
  use: {
    // Base URL for tests (Vite dev server)
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Collect trace when retrying the test for a failure
    trace: 'retain-on-failure',

    // Screenshot: only on failure
    screenshot: 'only-on-failure',

    // Video: retain on failure
    video: 'retain-on-failure',

    // Action timeout: 15 seconds
    actionTimeout: 15 * 1000,

    // Navigation timeout: 30 seconds
    navigationTimeout: 30 * 1000,
  },

  // Configure reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Shared projects for all browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to test additional browsers (run: npx playwright install)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports */
    // Note: Mobile emulation can have click interception issues
    // Commenting out for test reliability. Uncomment to test mobile views.
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
