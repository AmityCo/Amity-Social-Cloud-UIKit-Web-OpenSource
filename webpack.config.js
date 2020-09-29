const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package.json');

module.exports = (_, argv) => ({
  entry: './src/index.js',
  externals: [
    nodeExternals({
      allowlist: ['eko-sdk', /@fortawesome\/pro/],
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
      components: path.resolve(__dirname, 'src/components'),
      icons: path.resolve(__dirname, 'src/icons'),
      hocs: path.resolve(__dirname, 'src/hocs'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      mock: path.resolve(__dirname, 'src/mock'),
      constants: path.resolve(__dirname, 'src/constants'),
      helpers: path.resolve(__dirname, 'src/helpers'),
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
