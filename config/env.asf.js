const path = require('path');
const config = require('./common');

Object.assign(config, {
    host: 'https://echarts.apache.org/examples',
    cdnPayRootMap: {
        // zh: 'https://echarts-www.cdn.bcebos.com/examples',
        zh: 'https://cdn.jsdelivr.net/gh/apache/incubator-echarts-website@asf-site/examples',
        en: 'https://echarts.apache.org/examples'
    },
    mainSiteCDNPayRootMap: {
        // zh: 'https://echarts-www.cdn.bcebos.com',
        zh: 'https://cdn.jsdelivr.net/gh/apache/incubator-echarts-website@asf-site',
        en: 'https://echarts.apache.org'
    },
    mainSiteHost: 'https://echarts.apache.org',

    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../incubator-echarts-website/examples')
});

module.exports = config;
