const path = require('path');
const config = require('./common');

Object.assign(config, {
    releaseDestDir: path.resolve(__dirname, '../../incubator-echarts-website/next/next/examples')
});

module.exports = config;
