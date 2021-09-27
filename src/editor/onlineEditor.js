
import {store} from '../common/store';
import {URL_PARAMS, SCRIPT_URLS} from '../common/config';

const getRootPath = () => {
  const hasRootPath = store.sourceCode.indexOf('ROOT_PATH') >= 0;
  return hasRootPath ? `var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples'`: '';
}

export  const getCodeSandboxHTML = ()=>{

  const rootPathCode = getRootPath()
  return (`<!DOCTYPE>
  <html>
    <head>
      <meta charset="utf-8" />
    </head>
    <body>
      <div id="main" style="width: 600px; height: 400px;"></div>
      <script src="https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js"></script>
      <script type="text/javascript" src="${SCRIPT_URLS.echartsMinJS}"></script>
      <script type="text/javascript" src="${SCRIPT_URLS.echartsDir}/dist/extension/dataTool.min.js"></script>
      <script type="text/javascript" src="${SCRIPT_URLS.echartsGLMinJS}"></script>
      <script type="text/javascript" src="${SCRIPT_URLS.echartsStatMinJS}"></script>
      <script type="text/javascript">

var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

${rootPathCode}
${store.sourceCode}

option && myChart.setOption(option);

      </script>
    </body>
  </html>`)
}

export const codeSandboxPackage = {
    "name": "static",
    "version": "1.0.0",
    "description": "This is a static template with no bundling",
    "main": "index.html",
    "scripts": {
        "start": "serve",
        "build": "echo This is a static template, there is no bundler or bundling involved!"
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/codesandbox-app/static-template.git"
    },
    "keywords": ["static", "template", "codesandbox"],
    "author": "Ives van Hoorne",
    "license": "MIT",
    "bugs": {
        "url": "https://github.com/codesandbox-app/static-template/issues"
    },
    "homepage": "https://github.com/codesandbox-app/static-template#readme",
    "devDependencies": {
        "serve": "^11.2.0"
    }
}



export const staticConfig = `{
  "template": "static"
}`

export const getJSCode = () => {

  const rootPathCode = getRootPath()
  return (`
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;

  ${rootPathCode}
  ${store.sourceCode}

  option && myChart.setOption(option);` )
}

const js_external = ['https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js', SCRIPT_URLS.echartsMinJS, `${SCRIPT_URLS.echartsDir}/dist/extension/dataTool.min.js`, SCRIPT_URLS.echartsGLMinJS,  SCRIPT_URLS.echartsStatMinJS]
export const codePenJSExternal = js_external.join(';')

export const fiddleJSExternal =js_external.join(',')


export const HTML = `<div id="main" style="width: 600px; height: 400px;"></div>`