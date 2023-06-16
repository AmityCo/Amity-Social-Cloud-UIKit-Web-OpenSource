const {
  DefinePlugin,
  EnvironmentPlugin
} = require('webpack');
const mainWebpack = require('../webpack.config.js');
const pkg = require('../package.json');
module.exports = {
  stories: ['../src/**/*.stories.js'],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: ['@storybook/addon-actions', '@storybook/addon-backgrounds', '@storybook/addon-controls', '@storybook/addon-viewport', '@storybook/addon-toolbars', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  webpackFinal: async config => {
    config.plugins.push(new DefinePlugin({
      SC_DISABLE_SPEEDY: true,
      // storybook
      __VERSION__: `"${pkg.version}"`
    }), new EnvironmentPlugin(Object.keys(process.env).filter(key => key.startsWith('STORYBOOK'))));

    // Merge with resolve config from main webpack.
    // Main webpack is a function with two arguments that can both be left empty.
    config.resolve = {
      ...config.resolve,
      ...mainWebpack({}, {}).resolve
    };
    return config;
  },
  docs: {
    autodocs: true
  }
};