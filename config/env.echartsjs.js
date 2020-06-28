const path = require('path');
const config = require('./common');

Object.assign(config, {
    host: 'https://www.echartsjs.com/examples',
    cdnRoot: 'https://www.echartsjs.com/examples',
    mainSitePath: 'https://www.echartsjs.com',
    mainSiteCDNRoot: 'https://www.echartsjs.com',
    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../echarts-www/release/examples')
});

module.exports = config;
