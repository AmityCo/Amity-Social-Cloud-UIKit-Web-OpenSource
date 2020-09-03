const path = require('path');
const webpack = require('webpack');

module.exports = {
  stories: ['../src/**/*.stories.js'],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
  ],
  webpackFinal: async (config) => {
    config.resolve.extensions.push('.js');

    config.plugins.push(
      // fix static storybook styling
      new webpack.DefinePlugin({
        SC_DISABLE_SPEEDY: true,
      }),
    );

    return config;
  },
};
