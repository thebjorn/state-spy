import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.locator('div').filter({ hasText: 'data Object empty [] Array' }).nth(2)).toBeVisible();
  await expect(page.getByRole('button', { name: '{"x":0,"y":1} Object' })).toBeVisible();
  await expect(page.getByText('lorem ipsum dolor sit')).toBeVisible();
});
