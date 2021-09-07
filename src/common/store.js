// import * as matter from 'gray-matter';
import { URL_PARAMS } from '../common/config';
import CHART_LIST from '../data/chart-list-data';
import CHART_LIST_GL from '../data/chart-list-data-gl';

export const store = {
  cdnRoot: '',
  version: '',
  locale: '',

  darkMode: URL_PARAMS.theme === 'dark',
  enableDecal: 'decal' in URL_PARAMS,
  renderer: URL_PARAMS.renderer || 'canvas',

  typeCheck:
    getExampleConfig().ts && (URL_PARAMS.lang || '').toLowerCase() === 'ts',
  useDirtyRect: 'useDirtyRect' in URL_PARAMS,

  runCode: '',
  sourceCode: '',

  runHash: '',

  isMobile: window.innerWidth < 600,

  editorStatus: {
    type: '',
    message: ''
  }
};

function findExample(item) {
  return URL_PARAMS.c === item.id;
}
export function getExampleConfig() {
  const example = CHART_LIST.concat(CHART_LIST_GL).find(findExample);
  return example;
}

export function isGLExample() {
  return CHART_LIST_GL.find(findExample);
}

export function loadExampleCode() {
  return new Promise((resolve) => {
    const glFolder = URL_PARAMS.gl ? 'gl/' : '';
    const lang = store.typeCheck ? 'ts' : 'js';
    $.ajax(
      `${store.cdnRoot}examples/${lang}/${glFolder}${URL_PARAMS.c}.${lang}?_v_${store.version}`,
      {
        dataType: 'text',
        success: (data) => {
          resolve(data);
        }
      }
    );
  });
}

export function parseSourceCode(code) {
  return (
    code
      // remove front matter
      .replace(/\/\*[\w\W]*?\*\//, '')
      .trim()
      // ts code needs add `export {}` to be a module. remove it.
      // FIXME
      .replace(/export\s+\{\s*\}\s*;?$/g, '')
  );
}

let hashId = 123;
export function updateRunHash() {
  store.runHash = hashId++;
}
