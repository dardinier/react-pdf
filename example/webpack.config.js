const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const package_json = require('./package.json');

module.exports = {
  entry: {
    'index': './src/index.jsx',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    title: package_json.name,
    template: 'public/index.html'
  })]
};
