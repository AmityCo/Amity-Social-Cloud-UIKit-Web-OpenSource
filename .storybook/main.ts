import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-toolbars',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  staticDirs: ['../static'],
  viteFinal: async (config) => {
    // Force HTTPS for all assets
    config.server = {
      ...config.server,
      https: true,
      force: true,
    };

    return config;
  },
};

export default config;
