/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    host: '0.0.0.0',
    port: 9000,
  },
});
