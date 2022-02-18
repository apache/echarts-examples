const path = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./config');

module.exports = {
  entry: path.resolve(__dirname, 'tmp/tests/area-basic.minimal.js'),
  plugins: [new BundleAnalyzerPlugin()],
  resolve: {
    alias: {
      echarts: config.echartsDir,
      zrender: config.zrenderDir
    }
  },
  output: {
    path: path.resolve(__dirname, 'tmp/bundles/'),
    filename: 'area-basic.minimal.js'
  }
};
