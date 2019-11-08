const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: package_json.name,
      template: 'public/index.html'
    }),
    new CopyPlugin([
      { from: 'public/document-1.pdf', to: 'document-1.pdf' },
      { from: 'public/document-2.pdf', to: 'document-2.pdf' },
    ]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ]
};
