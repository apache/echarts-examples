const path = require('path');
const config = require('./common');

Object.assign(config, {
    host: 'https://echarts.apache.org/examples',
    // cdnRoot: 'https://echarts.cdn.apache.org/examples',
    cdnRootMap: {
        zh: 'https://echarts-www.bj.bcebos.com/examples',
        en: 'https://echarts.cdn.apache.org/examples'
    },
    mainSitePath: 'https://echarts.apache.org',
    // mainSiteCDNRoot: 'https://echarts.cdn.apache.org',
    mainSiteCDNRootMap: {
        zh: 'https://echarts-www.bj.bcebos.com',
        en: 'https://echarts.cdn.apache.org'
    },

    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../incubator-echarts-website/examples')
});

module.exports = config;
