import { expect, test } from '@playwright/test';
import { openCommunity, openPostComposer } from './support';

test('links after an unclosed "(" are still detected', { tag: '@PDT-6623' }, async ({ page }) => {
  const runId = `run-${Date.now()}`;
  const expectedLinks = ['https://example.com', 'www.google'];

  await openCommunity(page);
  const editor = await openPostComposer(page);

  await editor.pressSequentially(
    `https://example.com ://example.com ///example.com my_http://test http://example.com/path(1 mailto:t.com 1.bar www.google:-t example.com ${runId}`,
    { delay: 20 },
  );
  await page.waitForTimeout(3_000);

  const composerLinks = editor.locator('a');
  await expect.soft(composerLinks).toHaveText(expectedLinks);
  await expect.soft(composerLinks.nth(1)).toHaveAttribute('href', 'https://www.google');

  await page.getByRole('button', { name: 'Post', exact: true }).click();

  const post = page.locator('[data-testid="post-description"]').filter({ hasText: runId });
  await post.scrollIntoViewIfNeeded();
  const postLinks = post.locator('a');
  await expect(postLinks).toHaveText(expectedLinks);
  await expect(postLinks.nth(1)).toHaveAttribute('href', 'https://www.google');
  await page.waitForTimeout(2_000);
});
