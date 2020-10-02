const { DefinePlugin } = require('webpack');
const mainWebpack = require('../webpack.config.js');

module.exports = {
  stories: ['../src/**/*.stories.js'],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
    '@storybook/addon-backgrounds',
    '@storybook/addon-toolbars',
  ],
  webpackFinal: async config => {
    config.plugins.push(
      new DefinePlugin({
        SC_DISABLE_SPEEDY: true, // storybook
        __API_ENDPOINT__: `"${process.env.API_ENDPOINT_STAGING}"`
      })
    );

    // Merge with resolve config from main webpack.
    // Main webpack is a function with two arguments that can both be left empty.
    config.resolve = {
      ...config.resolve,
      ...mainWebpack({}, {}).resolve,
    };

    return config;
  },
};
