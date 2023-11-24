import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.js',
    '../src/**/*.stories.jsx',
    '../src/**/*.stories.ts',
    '../src/**/*.stories.tsx',
  ],
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
};

export default config;
