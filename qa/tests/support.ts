import type { Locator, Page } from '@playwright/test';

export const QA_USER_ID = process.env.QA_USER_ID ?? 'Web-Test';
export const QA_COMMUNITY_NAME = process.env.QA_COMMUNITY_NAME ?? '#test community';

const story = `/iframe.html?id=social--sdk-community-app-v-4&viewMode=story&globals=userId:${encodeURIComponent(QA_USER_ID)}`;

export async function openCommunity(page: Page, name = QA_COMMUNITY_NAME) {
  await page.goto(story);
  await page.getByText('Communities', { exact: true }).first().click();
  await page.getByText('My Communities', { exact: true }).click();
  await page.getByText(name, { exact: true }).first().click();
}

export async function openPostComposer(page: Page): Promise<Locator> {
  await page
    .getByText('What’s going on...')
    .or(page.getByText("What's going on..."))
    .first()
    .click();
  const editor = page.locator('[role="dialog"] [contenteditable="true"]').last();
  await editor.click();
  return editor;
}
