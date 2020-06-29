const path = require('path');
const config = require('./common');

Object.assign(config, {
    host: 'https://www.echartsjs.com/examples',

    cdnPayRootMap: {
        zh: 'https://www.echartsjs.com/examples',
        en: 'https://www.echartsjs.com/examples',
    },

    mainSiteCDNPayRootMap: {
        zh: 'https://www.echartsjs.com',
        en: 'https://www.echartsjs.com',
    },

    mainSiteHost: 'https://www.echartsjs.com',
    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../echarts-www/release/examples')
});

module.exports = config;
