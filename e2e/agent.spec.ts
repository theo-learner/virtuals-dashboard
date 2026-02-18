import { test, expect } from '@playwright/test';

test.describe('Agent Detail Page', () => {
  test('clicking an agent from ranking navigates to detail', async ({ page }) => {
    await page.goto('/');
    // Wait for table to load
    const firstAgentLink = page.locator('table tbody tr:first-child a').first();
    await firstAgentLink.waitFor({ timeout: 15000 });
    const href = await firstAgentLink.getAttribute('href');
    expect(href).toMatch(/\/agent\/.+/);
    await firstAgentLink.click();
    await expect(page).toHaveURL(/\/agent\//);
  });

  test('agent detail page shows agent info', async ({ page }) => {
    await page.goto('/');
    const firstAgentLink = page.locator('table tbody tr:first-child a').first();
    await firstAgentLink.waitFor({ timeout: 15000 });
    await firstAgentLink.click();
    await expect(page).toHaveURL(/\/agent\//);
    // Should have some content loaded
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });
});

test.describe('Analytics Page', () => {
  test('analytics page loads charts', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(50);
  });
});

test.describe('Locale Switcher', () => {
  test('switching locale changes nav text', async ({ page }) => {
    await page.goto('/');
    // Default is Korean
    await expect(page.locator('nav')).toContainText('대시보드');
    // Click EN button
    const enBtn = page.locator('nav button', { hasText: 'EN' });
    await enBtn.click();
    await expect(page.locator('nav')).toContainText('Dashboard');
  });
});
