import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Focus Hub/);
  await expect(page.locator('h1')).toContainText('Welcome');
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveURL(/.*about/);
});

test('theme toggle works', async ({ page }) => {
  await page.goto('/');
  const themeButton = page.locator('button[aria-label="Toggle theme"]');
  await themeButton.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
