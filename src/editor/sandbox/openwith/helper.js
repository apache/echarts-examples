import { store } from '../../../common/store';
import { SCRIPT_URLS } from '../../../common/config';

/**
 * Get templates
 * @param {string} code
 * @param {Array<{ src?: string, content?: string }>} scripts
 * @param {string} css
 */
export function getTemplates(title, scripts, css) {
  title = `${title ? title + ' - ' : ''}Apache ECharts Demo`;
  scripts = (scripts && scripts.slice()) || [];
  const lang = store.locale && store.locale.indexOf('zh') > -1 ? 'zh-CN' : 'en';

  const hasRootPath = store.sourceCode.indexOf('ROOT_PATH') > -1;
  const rootPathCode = hasRootPath ? `var ROOT_PATH = '${store.cdnRoot}';` : '';
  const hasJQuery = /\$[\.\(]+/g.test(store.sourceCode);
  hasJQuery &&
    scripts.unshift({
      src: SCRIPT_URLS.jQueryJS
    });

  const htmlTpl = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body>
  <div id="chart-container"></div>
  ${scripts
    .filter((script) => !script.src || script.src.indexOf('dat.gui') < 0)
    .map((script) =>
      script.content
        ? `<script>${script.content}</script>`
        : `<script src="${
            script.src.indexOf('api.map.baidu.com/api') > -1
              ? script.src.replace(/(ak=)(\S+)$/, '$1YOUR_API_KEY')
              : script.src
          }"></script>`
    )
    .join('\n  ')}
</body>
</html>`;

  const jsTpl = `var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, ${store.darkMode ? "'dark'" : 'null'}, {
  renderer: '${store.renderer}',
  useDirtyRect: ${store.useDirtyRect}
});
var app = {};
${rootPathCode}
var option;

${store.sourceCode}

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);`;

  const cssTpl = `* {
  margin: 0;
  padding: 0;
}
#chart-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
${css || ''}`;

  return {
    title,
    html: htmlTpl,
    js: jsTpl,
    css: cssTpl
  };
}
