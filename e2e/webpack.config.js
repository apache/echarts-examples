const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./config');

module.exports = (env, argv) => {
  return {
    mode: argv.mode || 'production',
    entry: path.resolve(__dirname, './tmp/tests/area-basic.minimal.js'),
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      })
    ],
    resolve: {
      alias: {
        echarts: config.echartsDir,
        zrender: config.zrenderDir
      }
    },
    output: {
      path: path.resolve(__dirname, './tmp/bundles'),
      filename: 'area-basic.minimal.js',
      clean: true
    }
  };
};
