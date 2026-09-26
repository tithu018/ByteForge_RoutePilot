import { expect, test, type Page } from '@playwright/test';

const password = 'DemoOnly-ChangeMe-2026!';
const accounts = [
  {
    path: '/dispatcher',
    email: 'dispatcher.demo@waypoint.local',
    heading: 'Today’s delivery operation',
  },
  {
    path: '/loader/active',
    email: 'loader.demo@waypoint.local',
    heading: 'Trip 1 loading checklist',
  },
  {
    path: '/driver/trip',
    email: 'driver.demo@waypoint.local',
    heading: 'Stop 1: Illustrative Riverside Outlet',
  },
  { path: '/store', email: 'store.demo@waypoint.local', heading: 'Outlet delivery view' },
];

async function login(page: Page, email: string) {
  await page.goto('/foundation');
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/login');
  await expect(page.getByLabel('Email')).toBeVisible({ timeout: 15000 });
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).not.toHaveURL(/\/login$/);
}

test('seeded role accounts reach their working operational screens', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const account of accounts) {
    await login(page, account.email);
    await page.goto(account.path);
    await expect(page.getByText(account.heading).first()).toBeVisible({ timeout: 15000 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('browser reaches API and PostgreSQL through the configured base URL', async ({ page }) => {
  await page.goto('/foundation');
  await expect(page.getByText('API connected', { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Database connected', { exact: true })).toBeVisible({
    timeout: 15000,
  });
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

test('driver offline queue survives reload and synchronizes', async ({ page }) => {
  test.setTimeout(60000);
  await login(page, 'driver.demo@waypoint.local');
  await page.goto('/driver/trip');
  await page.getByRole('button', { name: 'Record arrival' }).click();
  await page.getByRole('button', { name: 'Capture POD' }).click();
  await page.reload();
  await page.goto('/driver/sync');
  await expect(page.getByText('2 queued')).toBeVisible();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes('/api/v1/operations/delivery-events') && response.status() < 300,
    ),
    page.getByRole('button', { name: 'Sync now' }).click(),
  ]);
  await expect(page.getByText('0 queued')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('ACCEPTED').first()).toBeVisible({ timeout: 15000 });
});

test('form validation and recovery routes remain explicit', async ({ page }) => {
  await page.goto('/foundation');
  await page.getByRole('button', { name: 'Validate example' }).click();
  await expect(page.getByText('Enter at least two characters.')).toBeVisible();
  await page.goto('/access-denied');
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  await page.goto('/not-a-real-route');
  await expect(page.getByRole('heading', { name: 'This page wasn’t found' })).toBeVisible();
});
