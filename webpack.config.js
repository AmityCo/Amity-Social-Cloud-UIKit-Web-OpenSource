const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const pkg = require('./package.json');

module.exports = {
  entry: './src/index.js',
  externals: [nodeExternals({
    allowlist: ['eko-sdk', /@fortawesome\/pro/]
  })],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    library: pkg.name,
    libraryTarget: 'umd',
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      hocs: path.resolve(__dirname, 'src/hocs'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      mock: path.resolve(__dirname, 'src/mock'),
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
};
