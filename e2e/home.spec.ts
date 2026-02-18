import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads and shows header', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/버추얼스|Virtuals/i);
  });

  test('navbar is visible', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('navigates to analytics', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /analytics/i });
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL(/analytics/);
    }
  });

  test('navigates to insights', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /insights/i });
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL(/insights/);
    }
  });
});

test.describe('Not Found', () => {
  test('shows 404 for invalid route', async ({ page }) => {
    const resp = await page.goto('/nonexistent-xyz');
    expect(resp?.status()).toBe(404);
  });
});
