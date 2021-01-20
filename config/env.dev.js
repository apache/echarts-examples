const path = require('path');
const config = require('./common');

Object.assign(config, {
    host: 'http://localhost/echarts-website/v4/examples',

    cdnPayRootMap: {
        zh: 'http://localhost/echarts-website/v4/examples',
        en: 'http://localhost/echarts-website/v4/examples'
    },
    mainSiteCDNPayRootMap: {
        zh: 'http://localhost/echarts-website/v4',
        en: 'http://localhost/echarts-website/v4'
    },

    mainSiteHost: 'http://localhost/echarts-website/v4',

    releaseDestDir: path.resolve(__dirname, '../../../echarts-website/v4/examples')
});

module.exports = config;
