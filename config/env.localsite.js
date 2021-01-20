const path = require('path');
const config = require('./common');

Object.assign(config, {

    host: 'http://localhost/echarts-website/v4/examples',
    // host: 'http://localhost:8000/echarts/echarts-website/v4/examples',

    cdnPayRootMap: {
        zh: 'http://localhost/echarts-website/v4/examples',
        en: 'http://localhost/echarts-website/v4/examples'
    },

    mainSiteCDNPayRootMap: {
        zh: 'http://localhost/echarts-website/v4/examples',
        // zh: 'http://127.0.0.1:8000/echarts/echarts-website',
        en: 'http://localhost/echarts-website/v4'
    },

    mainSiteHost: 'http://localhost/echarts-website/v4',
    // mainSiteHost: 'http://localhost:8000/echarts/echarts-website',

    releaseDestDir: path.resolve(__dirname, '../../../echarts-website/v4/examples')
});

module.exports = config;
