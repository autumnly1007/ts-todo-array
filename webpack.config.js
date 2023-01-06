const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  output: {
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      template: './index.html',
    }),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new MiniCssExtractPlugin({}),
  ],
  devServer: {
    host: 'localhost',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
