const webpack = require('webpack');
const mainWebpack = require('../webpack.config.js');

module.exports = {
  stories: ['../src/**/*.stories.js'],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: ['@storybook/addon-storysource', '@storybook/addon-controls'],
  webpackFinal: async config => {
    config.plugins.push(
      // fix static storybook styling
      new webpack.DefinePlugin({
        SC_DISABLE_SPEEDY: true,
      }),
    );

    // Merge with resolve config from main webpack.
    config.resolve = {
      ...config.resolve,
      ...mainWebpack.resolve,
    };

    return config;
  },
};
