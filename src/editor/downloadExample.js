import {store} from '../common/store';
import {URL_PARAMS} from '../common/config';


const hasRootPath = store.code.indexOf('ROOT_PATH') >= 0;
const rootPathCode = hasRootPath ? `var ROOT_PATH = '${store.cdnRoot}'` : '';

export function download() {
    const code = `<!DOCTYPE html>
<html style="height: 100%">
    <head>
        <meta charset="utf-8">
    </head>
    <body style="height: 100%; margin: 0">
        <div id="container" style="height: 100%"></div>

        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
        <!-- Uncomment this line if you want to dataTool extension
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/dist/extension/dataTool.min.js"></script>
        -->
        <!-- Uncomment this line if you want to use gl extension
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts-gl/dist/echarts-gl.min.js"></script>
        -->
        <!-- Uncomment this line if you want to echarts-stat extension
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts-stat/dist/ecStat.min.js"></script>
        -->
        <!-- Uncomment this line if you want to use map
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/map/js/china.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/map/js/world.js"></script>
        -->
        <!-- Uncomment these two lines if you want to use bmap extension
        <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=<Your Key Here>"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts/dist/extension/bmap.min.js"></script>
        -->

        <script type="text/javascript">
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};

var option;

${rootPathCode}

${store.code}

if (option && typeof option === 'object') {
    myChart.setOption(option);
}

        </script>
    </body>
</html>
    `;
    const file = new Blob([code], {
        type: 'text/html;charset=UTF-8',
        encoding: 'UTF-8'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = URL_PARAMS.c + '.html';
    a.click();
}