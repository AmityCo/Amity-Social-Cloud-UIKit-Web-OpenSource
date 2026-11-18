import { expect, test } from '@playwright/test';
import { openMyProfileImages } from './support';

test('image viewer pages through the profile gallery', { tag: '@PDT-7185' }, async ({ page }) => {
  await openMyProfileImages(page);

  const gallery = page.getByTestId('image_gallery_item');
  await expect(gallery.nth(2)).toBeVisible();
  const total = await gallery.count();

  await gallery.nth(1).click();
  await page.waitForTimeout(1_000);

  const counter = page.getByText(/^\d+ \/ \d+$/);
  const prev = page.getByRole('button', { name: 'Click to go to previous image' });
  const next = page.getByRole('button', { name: 'Click to go to next image' });

  await expect(counter).toHaveText(`2 / ${total}`);
  await expect(prev).toBeVisible();
  await expect(next).toBeVisible();

  await prev.click();
  await expect(counter).toHaveText(`1 / ${total}`);
  await expect(prev).toBeHidden();

  await next.click();
  await next.click();
  await expect(counter).toHaveText(`3 / ${total}`);
  await page.waitForTimeout(1_500);
});
