export const EXAMPLE_CATEGORIES = [
  'line',
  'bar',
  'pie',
  'scatter',
  'map',
  'candlestick',
  'radar',
  'boxplot',
  'heatmap',
  'graph',
  'lines',
  'tree',
  'treemap',
  'sunburst',
  'parallel',
  'sankey',
  'funnel',
  'gauge',
  'pictorialBar',
  'themeRiver',
  'calendar',
  'matrix',
  'chord',
  'custom',

  'dataset',
  'dataZoom',
  'graphic',
  'rich',

  'globe',
  'bar3D',
  'scatter3D',
  'surface',
  'map3D',
  'lines3D',
  'line3D',
  'scatterGL',
  'linesGL',
  'flowGL',
  'graphGL'
];

export const BLACK_MAP = (function (list) {
  const map = {};
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = 1;
  }
  return location.href.indexOf('github.io') >= 0 ? {} : map;
})([
  'lines-airline',
  'scatter-world-population',
  'geo3d',
  'geo3d-with-different-height',
  'globe-country-carousel',
  'globe-with-echarts-surface',
  'map3d-alcohol-consumption',
  'map3d-wood-map',
  'scattergl-weibo',
  // FIXME 由于 CSP 问题，暂时屏蔽 BMap 相关示例
  'heatmap-bmap',
  'effectScatter-bmap',
  'lines-bmap',
  'lines-bmap-bus',
  'lines-bmap-effect',
  'map-bin',
  'global-wind-visualization',
  'global-wind-visualization-2'
]);

const URL_PARAMS = {};
(() =>
  // Object.fromEntries(new URLSearchParams(location.search).entries())
  new URLSearchParams(location.search).forEach(
    (val, key) => (URL_PARAMS[key] = val)
  ))();

export { URL_PARAMS };

/**
 * @param {'en' | 'zh'} locale
 */
export function getScriptURLs(locale) {
  return SCRIPT_URLS;
  // return locale === 'zh' ? SCRIPT_URLS_CN : SCRIPT_URLS;
}

// 优先使用官网的 window.EXAMPLES_CDN_ROOT 配置
const JSDELIVR_ROOT = 'https://fastly.jsdelivr.net/npm/';
export const CDN_ROOT = window.ECHARTS_WWW_VENDORS_CDN_ROOT || JSDELIVR_ROOT;
// const CDN_ROOT_CN = window.EXAMPLES_CDN_ROOT || 'https://lib.baomitu.com/';
// const CDN_ROOT_CN_NPM =
//   window.EXAMPLES_CDN_ROOT || 'https://registry.npmmirror.com/';

// IMPORTANT:
// DONT FORGET TO UPDATE THE JS/VENDORS IN THE ECHARTS-WWW
// 不要忘记更新 ECHARTS-WWW 中的 js/vendors
const SCRIPT_URLS = {
  echartsDir: `${JSDELIVR_ROOT}echarts@{{version}}`,
  echartsNightlyDir: `${JSDELIVR_ROOT}echarts-nightly@{{version}}`,

  latestEChartsDir: `${CDN_ROOT}echarts`,
  echartsJS: '/dist/echarts.min.js',

  localEChartsDir: 'http://localhost:8080',
  localEChartsGLDir: 'http://localhost/echarts-gl',

  prPreviewEChartsDir: 'https://echarts-pr-{{PR_NUMBER}}.surge.sh',

  // echartsWorldMapJS: `${JSDELIVR_ROOT}echarts@4.9.0/map/js/world.js`,
  echartsWorldMapJS: `https://echarts.apache.org/en/asset/map/js/world.js`,
  echartsStatJS: `${CDN_ROOT}echarts-stat/dist/ecStat.min.js`,
  echartsGLJS: `${CDN_ROOT}echarts-gl/dist/echarts-gl.min.js`,
  datGUIMinJS: `${CDN_ROOT}dat.gui@0.6.5/build/dat.gui.min.js`,
  monacoDir: `${CDN_ROOT}monaco-editor@0.27.0/min/vs`,
  aceDir: `${CDN_ROOT}ace-builds@1.4.12/src-min-noconflict`,
  prettierDir: `${CDN_ROOT}prettier@2.3.2`,
  // highlightjsDir: `https://fastly.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build`,
  highlightjsDir: `${CDN_ROOT}highlightjs/cdn-release@11.8.0/build`,
  seedrandomJS: `${CDN_ROOT}seedrandom@3.0.5/seedrandom.min.js`,
  jQueryJS: `${CDN_ROOT}jquery@3.7.1/dist/jquery.min.js`,
  acornJS: `${CDN_ROOT}acorn@8.7.1/dist/acorn.min.js`,

  bmapLibJS:
    'https://api.map.baidu.com/api?v=3.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu',
  echartsBMapJS: '/dist/extension/bmap.min.js',

  echartsGraphModularityJS: `${CDN_ROOT}echarts-graph-modularity/dist/echarts-graph-modularity.min.js`
};

// const SCRIPT_URLS_CN = {
//   echartsDir: `${CDN_ROOT_CN_NPM}echarts/{{version}}/files`,
//   echartsNightlyDir: `${CDN_ROOT_CN_NPM}echarts-nightly/{{version}}/files`,
//   echartsJS: SCRIPT_URLS.echartsJS,

//   localEChartsDir: SCRIPT_URLS.localEChartsDir,
//   localEChartsGLDir: SCRIPT_URLS.localEChartsGLDir,

//   prPreviewEChartsDir: SCRIPT_URLS.prPreviewEChartsDir,

//   echartsWorldMapJS: `${CDN_ROOT_CN_NPM}echarts/4.9.0/files/map/js/world.js`,
//   echartsStatJS: `${CDN_ROOT_CN_NPM}echarts-stat/latest/files/dist/ecStat.min.js`,
//   echartsGLJS: `${CDN_ROOT_CN_NPM}echarts-gl/2/files/dist/echarts-gl.min.js`,
//   datGUIMinJS: `${CDN_ROOT_CN}dat-gui/0.6.5/dat.gui.min.js`,
//   monacoDir: `${CDN_ROOT_CN_NPM}monaco-editor/0.27.0/files/min/vs`,
//   aceDir: `${CDN_ROOT_CN_NPM}ace-builds/1.4.12/files/src-min-noconflict`,
//   prettierDir: `${CDN_ROOT_CN}prettier/2.3.2`,
//   highlightjsDir: `${CDN_ROOT_CN_NPM}@highlightjs/cdn-assets/11.8.0/files`,
//   seedrandomJS: `${CDN_ROOT_CN}seedrandom/3.0.5/seedrandom.min.js`,
//   jQueryJS: `${CDN_ROOT_CN_NPM}jquery/3.7.1/files/dist/jquery.min.js`,
//   acornJS: `${CDN_ROOT_CN_NPM}acorn/8.7.1/files/dist/acorn.js`,

//   bmapLibJS: SCRIPT_URLS.bmapLibJS,
//   echartsBMapJS: SCRIPT_URLS.echartsBMapJS,

//   echartsGraphModularityJS: `${CDN_ROOT_CN_NPM}echarts-graph-modularity/2/files/dist/echarts-graph-modularity.min.js`
// };
