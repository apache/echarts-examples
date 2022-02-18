const path = require('path');
const config = require('./common');

Object.assign(config, {
  releaseDestDir: path.resolve(__dirname, '../../echarts-website/next/examples')
});

module.exports = config;
