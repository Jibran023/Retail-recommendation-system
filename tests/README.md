# Test Framework Documentation

## Overview

This project uses **Playwright** for End-to-End (E2E) testing and **Jest** for unit testing. The test framework is production-ready with fixtures, helpers, and page objects for maintainable tests.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Framework Architecture](#test-framework-architecture)
- [Directory Structure](#directory-structure)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [Debugging Tests](#debugging-tests)
- [CI/CD Integration](#cicd-integration)

---

## Quick Start

### Installation

```bash
# Install dependencies (including Playwright)
npm install

# Install Playwright browsers
npx playwright install
```

### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View HTML test report
npm run test:e2e:report
```

---

## Test Framework Architecture

### Components

1. **Fixtures** (`tests/support/fixtures/`)
   - Extended test fixtures with custom functionality
   - Data factories for generating test data
   - Auto-cleanup hooks

2. **Helpers** (`tests/support/helpers/`)
   - Reusable utility functions
   - API mocking utilities
   - Common selectors and wait strategies

3. **Page Objects** (`tests/support/page-objects/`)
   - Encapsulates page interactions
   - Follows Page Object Model pattern
   - Makes tests maintainable and reusable

### Design Patterns

- **Page Object Model**: Encapsulates page interactions in reusable classes
- **Factory Pattern**: Generates test data with realistic values
- **Helper Functions**: DRY principle for common test operations

---

## Directory Structure

```
tests/
├── e2e/                          # E2E test files
│   ├── search.spec.ts            # Search functionality tests
│   └── example.spec.ts           # Example test
│
├── support/                      # Test infrastructure (KEY PATTERN)
│   ├── fixtures/                 # Test fixtures
│   │   ├── index.ts              # Fixture exports
│   │   └── factories/            # Data factories
│   │       └── product-factory.ts # Product test data
│   │
│   ├── helpers/                  # Utility functions
│   │   └── test-helpers.ts       # Common helpers
│   │
│   └── page-objects/             # Page object models
│       └── SearchPage.ts         # Search page interactions
│
└── README.md                     # This file
```

---

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../support/fixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const expected = 'result';

    // Act
    await page.click('button');

    // Assert
    await expect(page).toHaveText(expected);
  });
});
```

### Using Page Objects

```typescript
import { SearchPage } from '../support/page-objects/SearchPage';

test('should search for products', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.goto();
  await searchPage.search('Cooking Oil');
  await searchPage.waitForResults();

  const hasResults = await searchPage.hasResults();
  expect(hasResults).toBeTruthy();
});
```

### Using Data Factories

```typescript
import { ProductFactory } from '../support/fixtures/factories/product-factory';

test('should display product cards', async ({ page }) => {
  const mockProduct = ProductFactory.createProduct({
    name: 'Cooking Oil 5kg - Habib',
  });

  // Mock API response
  await page.route('**/api/v1/products*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [mockProduct] }),
    });
  });

  // Test with mocked data
});
```

### Using Helper Functions

```typescript
import { getByTestId, waitForLoadingToFinish } from '../support/helpers/test-helpers';

test('should wait for loading', async ({ page }) => {
  await page.goto('/');
  await page.click(getByTestId('search-button'));
  await waitForLoadingToFinish(page);
});
```

---

## Running Tests

### Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all E2E tests (headless) |
| `npm run test:e2e:ui` | Run tests in Playwright UI mode |
| `npm run test:e2e:headed` | Run tests in visible browser |
| `npm run test:e2e:debug` | Debug tests with inspector |
| `npm run test:e2e:report` | View HTML test report |

### Running Specific Tests

```bash
# Run a single test file
npx playwright test search.spec.ts

# Run tests matching a pattern
npx playwright test --grep "search"

# Run tests in specific project (browser)
npx playwright test --project=chromium
```

---

## Best Practices

### 1. Use data-testid Attributes

**Good:**
```typescript
await page.click('[data-testid="search-button"]');
```

**Avoid:**
```typescript
await page.click('.MuiButton-root'); // Brittle!
```

### 2. Wait for Elements Properly

**Good:**
```typescript
await page.waitForSelector('[data-testid="results"]');
```

**Avoid:**
```typescript
await page.waitForTimeout(2000); // Brittle!
```

### 3. Use Page Objects

**Good:**
```typescript
const searchPage = new SearchPage(page);
await searchPage.search('Oil');
```

**Avoid:**
```typescript
await page.fill('input', 'Oil'); // Hard to maintain
await page.click('button');
```

### 4. Mock External Dependencies

```typescript
// Mock API responses for faster, reliable tests
await page.route('**/api/v1/products*', (route) => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true, data: [] }),
  });
});
```

### 5. Test User Behavior, Not Implementation

**Good:**
```typescript
test('user can search for products', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'Oil');
  await page.press('[data-testid="search-input"]', 'Enter');
  await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
});
```

**Avoid:**
```typescript
test('search function is called', async ({ page }) => {
  // Testing implementation details
  expect(searchFunction).toHaveBeenCalled();
});
```

---

## Debugging Tests

### Playwright Inspector

```bash
npm run test:e2e:debug
```

- Opens Playwright Inspector
- Step through tests line by line
- Inspect DOM, network, console

### UI Mode

```bash
npm run test:e2e:ui
```

- Interactive test runner
- Watch mode (re-run on file changes)
- Time travel debugging
- Visual traces

### Headed Mode

```bash
npm run test:e2e:headed
```

- See browser while tests run
- Useful for debugging flaky tests

### Screenshots & Videos

Playwright automatically captures:
- **Screenshots**: On test failure
- **Videos**: On test failure
- **Traces**: On test failure

View traces:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/html/
          retention-days: 30
```

### Vercel Integration

Tests run automatically on deploy via Vercel's CI/CD.

---

## Test Coverage

### Current Test Coverage

| Feature | Tests | Status |
|---------|-------|--------|
| Search Functionality | `search.spec.ts` | ✅ Implemented |
| Product Display | `search.spec.ts` | ✅ Implemented |
| Error Handling | `search.spec.ts` | ✅ Implemented |
| Loading States | `search.spec.ts` | ✅ Implemented |
| Keyboard Navigation | `search.spec.ts` | ✅ Implemented |
| Accessibility | `search.spec.ts` | ✅ Implemented |

### Adding New Tests

1. Create test file in `tests/e2e/`
2. Use fixtures and helpers
3. Create page objects if needed
4. Run tests locally first
5. Commit with descriptive message

---

## Troubleshooting

### Tests Failing Locally

1. **Check if dev server is running**: Tests auto-start dev server via `webServer` config
2. **Clear browser cache**: `npx playwright install --force`
3. **Update Playwright**: `npm install -D @playwright/test@latest`

### Tests Failing in CI

1. **Check timeout values**: CI may be slower than local
2. **Verify environment variables**: Set in CI/CD settings
3. **Check browser installation**: `npx playwright install --with-deps`

### Flaky Tests

1. **Use proper waits**: `waitForSelector` instead of `waitForTimeout`
2. **Check network**: Mock API responses in tests
3. **Race conditions**: Ensure async operations complete before asserting

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Jest Documentation](https://jestjs.io)

---

## Questions?

For questions or issues with tests:
1. Check this README
2. Check Playwright docs
3. Ask in team chat
4. Create GitHub issue
