# Task 28: End-to-End Testing

> **Phase**: 5 - Polish & Deploy
> **Complexity**: Medium
> **Dependencies**: All previous tasks
> **Status**: Pending

## Description

Implement end-to-end tests using Playwright to verify the complete user flow from URL input to visualization display.

## Acceptance Criteria

- [ ] Playwright configured for Next.js
- [ ] Test: URL input validation
- [ ] Test: Analysis initiation
- [ ] Test: Visualization rendering
- [ ] Test: Error handling
- [ ] Tests run in CI/CD

## Implementation

### Install Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Test: Home Page & URL Input

Create `e2e/home.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Neuro-Acoustic');

    // Check for URL input
    await expect(page.getByPlaceholder(/youtube/i)).toBeVisible();

    // Check for analyze button
    await expect(page.getByRole('button', { name: /analyze/i })).toBeVisible();
  });

  test('should validate YouTube URL input', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder(/youtube/i);
    const button = page.getByRole('button', { name: /analyze/i });

    // Empty input
    await button.click();
    await expect(page.getByText(/please enter/i)).toBeVisible();

    // Invalid URL
    await input.fill('not-a-url');
    await button.click();
    await expect(page.getByText(/invalid/i)).toBeVisible();

    // Invalid domain
    await input.fill('https://vimeo.com/123456');
    await button.click();
    await expect(page.getByText(/youtube/i)).toBeVisible();

    // Valid YouTube URL
    await input.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await expect(page.getByText(/invalid/i)).not.toBeVisible();
  });

  test('should accept various YouTube URL formats', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder(/youtube/i);
    const validUrls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ];

    for (const url of validUrls) {
      await input.fill(url);
      await expect(page.getByText(/invalid/i)).not.toBeVisible();
    }
  });
});
```

### Test: Analysis Flow

Create `e2e/analysis.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Analysis Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to analyze page with valid URL', async ({ page }) => {
    const testVideoId = 'dQw4w9WgXcQ';
    const input = page.getByPlaceholder(/youtube/i);
    const button = page.getByRole('button', { name: /analyze/i });

    await input.fill(`https://www.youtube.com/watch?v=${testVideoId}`);
    await button.click();

    // Should navigate to analysis page
    await expect(page).toHaveURL(new RegExp(`/analyze/${testVideoId}`));
  });

  test('should display loading state during analysis', async ({ page }) => {
    const testVideoId = 'dQw4w9WgXcQ';

    await page.goto(`/analyze/${testVideoId}`);

    // Should show loading/progress indicator
    await expect(
      page.getByText(/analyzing|loading|preparing/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display video player', async ({ page }) => {
    const testVideoId = 'dQw4w9WgXcQ';

    await page.goto(`/analyze/${testVideoId}`);

    // Should show YouTube iframe
    await expect(page.locator('iframe[src*="youtube"]')).toBeVisible({
      timeout: 10000,
    });
  });
});
```

### Test: Visualizations

Create `e2e/visualizations.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

// Mock analysis data for testing
test.describe('Visualization Components', () => {
  test.skip('should render brain diagram when analysis complete', async ({ page }) => {
    // This test requires mock data - skip in real E2E
    await page.goto('/analyze/dQw4w9WgXcQ');

    // Wait for analysis to complete (or timeout)
    await page.waitForSelector('[data-testid="brain-diagram"]', {
      timeout: 120000,
    });

    // Check brain regions are rendered
    const regions = page.locator('[data-testid="brain-region"]');
    await expect(regions.first()).toBeVisible();
  });

  test.skip('should render brainwave chart', async ({ page }) => {
    await page.goto('/analyze/dQw4w9WgXcQ');

    await page.waitForSelector('[data-testid="brainwave-chart"]', {
      timeout: 120000,
    });

    // Check all 5 wave types are shown
    const waveLabels = ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'];
    for (const label of waveLabels) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test.skip('should render emotion badge', async ({ page }) => {
    await page.goto('/analyze/dQw4w9WgXcQ');

    await page.waitForSelector('[data-testid="emotion-badge"]', {
      timeout: 120000,
    });

    // Should show confidence percentage
    await expect(page.getByText(/%/)).toBeVisible();
  });
});
```

### Test: Error Handling

Create `e2e/errors.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should show error for non-existent video', async ({ page }) => {
    // Use an invalid video ID
    await page.goto('/analyze/invalid_video_id_12345');

    // Should show error message
    await expect(
      page.getByText(/not found|unavailable|error/i).first()
    ).toBeVisible({ timeout: 30000 });
  });

  test('should show network error when offline', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    const input = page.getByPlaceholder(/youtube/i);
    const button = page.getByRole('button', { name: /analyze/i });

    await input.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await button.click();

    // Should show network error
    await expect(
      page.getByText(/network|connection|offline/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Go back online
    await context.setOffline(false);
  });
});
```

### Test: Responsive Design

Create `e2e/responsive.spec.ts`:

```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should be usable on mobile', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 13'].viewport);
    await page.goto('/');

    // Input should be full width
    const input = page.getByPlaceholder(/youtube/i);
    await expect(input).toBeVisible();

    // Button should be accessible
    const button = page.getByRole('button', { name: /analyze/i });
    await expect(button).toBeVisible();
  });

  test('should be usable on tablet', async ({ page }) => {
    await page.setViewportSize(devices['iPad'].viewport);
    await page.goto('/');

    await expect(page.getByPlaceholder(/youtube/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /analyze/i })).toBeVisible();
  });
});
```

### Update package.json

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

### CI Configuration

Create `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Files to Create

| File | Description |
|------|-------------|
| `playwright.config.ts` | Playwright configuration |
| `e2e/home.spec.ts` | Home page tests |
| `e2e/analysis.spec.ts` | Analysis flow tests |
| `e2e/visualizations.spec.ts` | Visualization tests |
| `e2e/errors.spec.ts` | Error handling tests |
| `e2e/responsive.spec.ts` | Responsive design tests |
| `.github/workflows/e2e.yml` | CI workflow |

## Testing

- [ ] All tests pass locally
- [ ] Tests pass in CI
- [ ] Mobile viewport tests pass
- [ ] Error scenarios covered
- [ ] Report generates correctly

---

_Task 28 of 28 - neuro-acoustic-analyzer_
