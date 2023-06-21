const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');
const pkg = require('./package.json');

module.exports = (_, argv = {}) => ({
  entry: './src/index.js',
  externals: [nodeExternals()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    library: pkg.name,
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
    clean: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      __VERSION__: `"${pkg.version}"`,
    }),
    argv.analyze === 'true' && new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.css', '.svg'],
  },
});
