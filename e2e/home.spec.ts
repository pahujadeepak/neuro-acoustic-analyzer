import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check for URL input
    await expect(page.getByPlaceholder(/youtube/i)).toBeVisible();

    // Check for analyze button
    await expect(page.getByRole('button', { name: /analyze/i })).toBeVisible();
  });

  test('should validate YouTube URL input', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder(/youtube/i);
    const button = page.getByRole('button', { name: /analyze/i });

    // Invalid URL should show error
    await input.fill('not-a-url');
    await button.click();
    await expect(page.getByText(/invalid|please enter/i)).toBeVisible();
  });

  test('should accept valid YouTube URL', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder(/youtube/i);

    // Valid YouTube URL
    await input.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Should not show invalid error for valid URL
    await expect(page.getByText(/invalid youtube/i)).not.toBeVisible();
  });
});

test.describe('Analysis Page', () => {
  test('should display video player on analysis page', async ({ page }) => {
    await page.goto('/analyze/dQw4w9WgXcQ');

    // Should show YouTube iframe
    await expect(page.locator('iframe[src*="youtube"]')).toBeVisible({
      timeout: 10000,
    });
  });
});
