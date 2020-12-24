const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package.json');

module.exports = (_, argv = {}) => ({
  entry: './src/index.js',
  externals: [
    nodeExternals({
      allowlist: [/@fortawesome\/pro/],
    }),
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    library: pkg.name,
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  plugins: [
    new CleanWebpackPlugin(),
    argv.analyze === 'true' && new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.css', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
});
