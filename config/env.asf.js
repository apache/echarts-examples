const path = require('path');
const config = require('./common');

Object.assign(config, {
    host: 'https://echarts.apache.org/v4/examples',
    cdnPayRootMap: {
        // zh: 'https://echarts-www.cdn.bcebos.com/examples',
        zh: 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/v4/examples',
        en: 'https://echarts.apache.org/v4/examples'
    },
    mainSiteCDNPayRootMap: {
        // zh: 'https://echarts-www.cdn.bcebos.com',
        zh: 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/v4',
        en: 'https://echarts.apache.org/v4'
    },
    mainSiteHost: 'https://echarts.apache.org/v4',

    releaseDestDir: path.resolve(__dirname, '../../../echarts-website/v4/examples')
});

module.exports = config;
