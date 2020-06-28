const path = require('path');
const config = require('./common');

Object.assign(config, {

    host: 'http://localhost/incubator-echarts-website/examples',
    cdnRoot: 'http://localhost/incubator-echarts-website/examples',
    // host: 'http://localhost:8000/echarts/incubator-echarts-website/examples',
    // cdnRoot: 'http://127.0.0.1:8000/echarts/incubator-echarts-website/examples',

    cdnRootMap: {
        zh: 'https://echarts-www.bj.bcebos.com/examples',
        en: 'http://127.0.0.1:8000/echarts/incubator-echarts-website/examples'
    },

    mainSitePath: 'http://localhost/incubator-echarts-website',
    mainSiteCDNRoot: 'http://localhost/incubator-echarts-website',

    // mainSitePath: 'http://localhost:8000/echarts/incubator-echarts-website',
    // mainSiteCDNRoot: 'http://127.0.0.1:8000/echarts/incubator-echarts-website',

    mainSiteCDNRootMap: {
        zh: 'https://echarts-www.bj.bcebos.com',
        en: 'http://127.0.0.1:8000/echarts/incubator-echarts-website'
    },

    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../incubator-echarts-website/examples')
});

module.exports = config;
