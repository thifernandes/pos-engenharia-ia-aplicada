import { test, expect } from '@playwright/test';

test.describe('Image form', () => {
  test('submitting a valid form adds a new card to the list', async ({ page }) => {
    await page.goto('/vanilla-js-web-app-example/');

    const cardList = page.locator('main article');
    const initialCount = await cardList.count();

    const uniqueTitle = `Card ${Date.now()}`;

    await page.getByRole('textbox', { name: 'Image Title' }).fill(uniqueTitle);
    await page
      .getByRole('textbox', { name: 'Image URL' })
      .fill('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop');
    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
    await expect(cardList).toHaveCount(initialCount + 1);
  });

  test('invalid submission shows validation messages and does not update the list', async ({ page }) => {
    await page.goto('/vanilla-js-web-app-example/');

    const cardList = page.locator('main article');
    const initialCount = await cardList.count();

    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.getByText('Please type a title for the image.')).toBeVisible();
    await expect(page.getByText('Please type a valid URL')).toBeVisible();
    await expect(cardList).toHaveCount(initialCount);
  });
});
