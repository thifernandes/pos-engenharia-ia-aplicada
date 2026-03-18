const { test, expect } = require('@playwright/test');

test('home page loads with expected title and heading', async ({ page }) => {
  await page.goto('/vanilla-js-web-app-example/');
  await expect(page).toHaveTitle(/TDD Frontend Example/i);
  await expect(page.getByPlaceholder('Image Title')).toBeVisible();
  await expect(page.getByPlaceholder('https://img.com/erick.png')).toBeVisible();
});
