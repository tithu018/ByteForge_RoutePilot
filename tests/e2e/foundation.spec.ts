import { test, expect } from '@playwright/test';

test('all four role previews render and fit the viewport', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const [path, role] of [['dispatcher', 'Dispatcher'], ['loader', 'Loader'], ['driver', 'Driver'], ['store', 'Store Manager']]) {
    await page.goto(`/${path}`);
    await expect(page.getByRole('heading', { level: 1, name: `${role} workspace` })).toBeVisible();
    await expect(page.getByText('Phase 2 · Shell only')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
test('browser reaches API and PostgreSQL through the configured base URL', async ({ page }) => {
  await page.goto('/foundation');
  await expect(page.getByText('API connected', { exact: true })).toBeVisible();
  await expect(page.getByText('Database connected', { exact: true })).toBeVisible();
});
test('dialog manages focus and closes with Escape', async ({ page }) => {
  await page.goto('/foundation');
  const trigger = page.getByRole('button', { name: 'Open dialog', exact: true });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Example dialog' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test('form validation and recovery routes remain explicit placeholders', async ({ page }) => {
  await page.goto('/foundation');
  await page.getByRole('button', { name: 'Validate example' }).click();
  await expect(page.getByText('Enter at least two characters.')).toBeVisible();
  await page.goto('/access-denied');
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  await page.goto('/not-a-real-route');
  await expect(page.getByRole('heading', { name: 'This page wasn’t found' })).toBeVisible();
});
