const path = require('path');

module.exports = {
    host: 'http://localhost/incubator-echarts-website/examples',
    cdnRoot: 'http://localhost/incubator-echarts-website/examples',
    mainSitePath: 'http://localhost/incubator-echarts-website',
    mainSiteCDNRoot: 'http://localhost/incubator-echarts-website',

    // host: 'http://localhost:8000/echarts/incubator-echarts-website/examples',
    // cdnRoot: 'http://127.0.0.1:8000/echarts/incubator-echarts-website/examples',
    // mainSitePath: 'http://localhost:8000/echarts/incubator-echarts-website',
    // mainSiteCDNRoot: 'http://127.0.0.1:8000/echarts/incubator-echarts-website',

    blogPath: 'http://efe.baidu.com/tags/ECharts/',
    releaseDestDir: path.resolve(__dirname, '../../incubator-echarts-website/examples')
};
