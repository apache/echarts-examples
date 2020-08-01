const path = require('path');
const config = require('./common');

Object.assign(config, {

    host: 'http://localhost/incubator-echarts-website/next/examples',
    // host: 'http://localhost:8000/echarts/incubator-echarts-website/examples',

    cdnPayRootMap: {
        zh: 'http://localhost/incubator-echarts-website/next/examples',
        en: 'http://127.0.0.1:8000/echarts/incubator-echarts-website/next/examples'
    },

    mainSiteCDNPayRootMap: {
        zh: 'http://localhost/incubator-echarts-website/next/examples',
        // zh: 'http://127.0.0.1:8000/echarts/incubator-echarts-website',
        en: 'http://127.0.0.1:8000/echarts/incubator-echarts-website'
    },

    mainSiteHost: 'http://localhost/incubator-echarts-website',
    // mainSiteHost: 'http://localhost:8000/echarts/incubator-echarts-website',

    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../incubator-echarts-website/next/examples')
});

module.exports = config;
