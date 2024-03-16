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

export const THEMES = {
  default: [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc'
  ],
  dark: [
    '#4992ff',
    '#7cffb2',
    '#fddd60',
    '#ff6e76',
    '#58d9f9',
    '#05c091',
    '#ff8a45',
    '#8d48e3',
    '#dd79ff'
  ]
};

export const BLACK_MAP = (function (list) {
  const map = {};
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = 1;
  }
  return location.href.indexOf('github.io') >= 0 ? {} : map;
})([
  'effectScatter-map',
  'geo-lines',
  'geo-map-scatter',
  'heatmap-map',
  'lines-airline',
  'map-china',
  'map-china-dataRange',
  'map-labels',
  'map-locate',
  'map-province',
  'map-world',
  'map-world-dataRange',
  'scatter-map',
  'scatter-map-brush',
  'scatter-weibo',
  'scatter-world-population',
  'geo3d',
  'geo3d-with-different-height',
  'globe-country-carousel',
  'globe-with-echarts-surface',
  'map3d-alcohol-consumption',
  'map3d-wood-map',
  'scattergl-weibo'
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
  return locale === 'zh' ? SCRIPT_URLS_CN : SCRIPT_URLS;
}

const CDN_ROOT = 'https://fastly.jsdelivr.net/npm/';
const CDN_ROOT_CN = 'https://lib.baomitu.com/';
const CDN_ROOT_CN_NPM = 'https://registry.npmmirror.com/';

const SCRIPT_URLS = {
  echartsDir: `${CDN_ROOT}echarts@{{version}}`,
  echartsNightlyDir: `${CDN_ROOT}echarts-nightly@{{version}}`,
  echartsJS: '/dist/echarts.min.js',

  localEChartsDir: 'http://localhost/echarts',
  localEChartsGLDir: 'http://localhost/echarts-gl',

  prPreviewEChartsDir: 'https://echarts-pr-{{PR_NUMBER}}.surge.sh',

  echartsWorldMapJS: `${CDN_ROOT}echarts@4.9.0/map/js/world.js`,
  echartsStatJS: `${CDN_ROOT}echarts-stat@latest/dist/ecStat.min.js`,
  echartsGLJS: `${CDN_ROOT}echarts-gl@2/dist/echarts-gl.min.js`,
  datGUIMinJS: `${CDN_ROOT}dat.gui@0.6.5/build/dat.gui.min.js`,
  monacoDir: `${CDN_ROOT}monaco-editor@0.27.0/min/vs`,
  aceDir: `${CDN_ROOT}ace-builds@1.4.12/src-min-noconflict`,
  prettierDir: `${CDN_ROOT}prettier@2.3.2`,
  highlightjsDir: `https://fastly.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build`,
  seedrandomJS: `${CDN_ROOT}seedrandom@3.0.5/seedrandom.min.js`,
  jQueryJS: `${CDN_ROOT}jquery@3.7.1/dist/jquery.min.js`,
  acornJS: `${CDN_ROOT}acorn@8.7.1/dist/acorn.min.js`,

  bmapLibJS:
    'https://api.map.baidu.com/api?v=3.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu',
  echartsBMapJS: '/dist/extension/bmap.min.js'
};

const SCRIPT_URLS_CN = {
  echartsDir: `${CDN_ROOT_CN_NPM}echarts/{{version}}/files`,
  echartsNightlyDir: `${CDN_ROOT_CN_NPM}echarts-nightly/{{version}}/files`,
  echartsJS: SCRIPT_URLS.echartsJS,

  localEChartsDir: SCRIPT_URLS.localEChartsDir,
  localEChartsGLDir: SCRIPT_URLS.localEChartsGLDir,

  prPreviewEChartsDir: SCRIPT_URLS.prPreviewEChartsDir,

  echartsWorldMapJS: `${CDN_ROOT_CN_NPM}echarts/4.9.0/files/map/js/world.js`,
  echartsStatJS: `${CDN_ROOT_CN_NPM}echarts-stat/latest/files/dist/ecStat.min.js`,
  echartsGLJS: `${CDN_ROOT_CN_NPM}echarts-gl/2/files/dist/echarts-gl.min.js`,
  datGUIMinJS: `${CDN_ROOT_CN}dat-gui/0.6.5/dat.gui.min.js`,
  monacoDir: `https://cdn.staticfile.net/monaco-editor/0.27.0/min/vs`,
  aceDir: `${CDN_ROOT_CN_NPM}ace-builds/1.4.12/files/src-min-noconflict`,
  prettierDir: `${CDN_ROOT_CN}prettier/2.3.2`,
  highlightjsDir: `${CDN_ROOT_CN_NPM}@highlightjs/cdn-assets/11.8.0/files`,
  seedrandomJS: `${CDN_ROOT_CN}seedrandom/3.0.5/seedrandom.min.js`,
  jQueryJS: `https://cdn.staticfile.net/jquery/3.7.1/jquery.min.js`,
  acornJS: `https://cdn.staticfile.net/acorn/8.7.1/acorn.min.js`,

  bmapLibJS: SCRIPT_URLS.bmapLibJS,
  echartsBMapJS: SCRIPT_URLS.echartsBMapJS
};
