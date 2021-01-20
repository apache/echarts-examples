const path = require('path');
const config = require('./common');

Object.assign(config, {

    host: 'http://localhost/echarts-website/examples',
    // host: 'http://localhost:8000/echarts/echarts-website/examples',

    cdnPayRootMap: {
        zh: 'http://localhost/echarts-website/examples',
        en: 'http://127.0.0.1:8000/echarts/echarts-website/examples'
    },

    mainSiteCDNPayRootMap: {
        zh: 'http://localhost/echarts-website/examples',
        // zh: 'http://127.0.0.1:8000/echarts/echarts-website',
        en: 'http://127.0.0.1:8000/echarts/echarts-website'
    },

    mainSiteHost: 'http://localhost/echarts-website',
    // mainSiteHost: 'http://localhost:8000/echarts/echarts-website',

    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../../echarts-website/v4/examples')
});

module.exports = config;
