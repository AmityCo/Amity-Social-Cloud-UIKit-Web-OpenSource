import { defineConfig } from '@playwright/test';

const port = Number(process.env.QA_STORYBOOK_PORT ?? 6006);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 120_000,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1280, height: 720 },
    channel: process.env.QA_BROWSER_CHANNEL ?? 'chrome',
    launchOptions: {
      args: ['--autoplay-policy=no-user-gesture-required'],
      slowMo: Number(process.env.QA_SLOW_MO ?? 0),
    },
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm storybook --port ${port} --ci`,
    cwd: '..',
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
