// import * as matter from 'gray-matter';
import { URL_PARAMS } from '../common/config';
import CHART_LIST from '../data/chart-list-data';
import CHART_LIST_GL from '../data/chart-list-data-gl';
import { compressStr, decompressStr } from './helper';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const store = {
  echartsVersion: URL_PARAMS.version || '5',

  cdnRoot: '',
  version: '',
  locale: '',

  darkMode: URL_PARAMS.theme === 'dark',
  enableDecal: 'decal' in URL_PARAMS,
  renderer: URL_PARAMS.renderer || 'canvas',

  typeCheck:
    getExampleConfig() &&
    getExampleConfig().ts &&
    (URL_PARAMS.lang || '').toLowerCase() === 'ts',
  useDirtyRect: 'useDirtyRect' in URL_PARAMS,

  // for share
  initialCode: '',
  runCode: '',
  sourceCode: '',

  isSharedCode: false,

  runHash: '',

  isMobile: window.innerWidth < 600,

  editorStatus: {
    type: '',
    message: ''
  },

  randomSeed: URL_PARAMS.random || 'echarts'
};

function findExample(item) {
  return URL_PARAMS.c === item.id;
}

export function updateRandomSeed() {
  store.randomSeed = nanoid();
}

export function getExampleConfig() {
  const example = CHART_LIST.concat(CHART_LIST_GL).find(findExample);
  return example;
}

export function isGLExample() {
  return CHART_LIST_GL.find(findExample);
}

const LOCAL_EXAMPLE_CODE_STORE_KEY = 'echarts-examples-code';

export function saveExampleCodeToLocal() {
  localStorage.setItem(
    LOCAL_EXAMPLE_CODE_STORE_KEY,
    compressStr(
      JSON.stringify({
        code: store.sourceCode,
        lang: store.typeCheck ? 'ts' : 'js'
      })
    )
  );
}

export function loadExampleCodeFromLocal() {
  try {
    return JSON.parse(
      decompressStr(localStorage.getItem(LOCAL_EXAMPLE_CODE_STORE_KEY))
    );
  } catch (e) {
    return null;
  }
}

export function clearLocalExampleCode() {
  localStorage.removeItem(LOCAL_EXAMPLE_CODE_STORE_KEY);
}

export function loadExampleCode() {
  const localCode = loadExampleCodeFromLocal();
  if (localCode) {
    clearLocalExampleCode();
    return Promise.resolve(localCode.code);
  }
  return new Promise((resolve, reject) => {
    // ignore c if code is provided
    if (URL_PARAMS.code) {
      try {
        // PENDING fallback to `c` if the decompressed code is not available?
        const code = decompressStr(URL_PARAMS.code);
        store.isSharedCode = !!code;
        return code
          ? resolve(code)
          : reject('code was decompressed but got nothing');
      } catch (e) {
        console.error(e);
        return reject('failed to decompress code');
      }
    }
    const glFolder = 'gl' in URL_PARAMS ? 'gl/' : '';
    const lang = store.typeCheck ? 'ts' : 'js';
    $.ajax(
      `${store.cdnRoot}/examples/${lang}/${glFolder}${URL_PARAMS.c}.${lang}?_v_${store.version}`,
      {
        dataType: 'text',
        success(data) {
          resolve(data);
        },
        error() {
          reject('failed to load example', URL_PARAMS.c);
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
