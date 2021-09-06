// import * as matter from 'gray-matter';
import { URL_PARAMS } from '../common/config';

export const store = {
  cdnRoot: '',
  version: '',
  locale: '',

  darkMode: URL_PARAMS.theme === 'dark',
  enableDecal: 'decal' in URL_PARAMS,
  renderer: URL_PARAMS.renderer || 'canvas',

  typeCheck: URL_PARAMS.editor === 'monaco',
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

export function loadExampleCode() {
  return new Promise((resolve) => {
    const dataRoot = URL_PARAMS.gl ? 'data-gl' : 'data';
    $.ajax(
      store.typeCheck
        ? `${store.cdnRoot}/examples/ts/${URL_PARAMS.c}.ts?_v_${store.version}`
        : `${store.cdnRoot}/${dataRoot}/${URL_PARAMS.c}.js?_v_${store.version}`,
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
      .replace(/export\s+\{\s*\}\s*;?$/g, '')
  );
}

let hashId = 123;
export function updateRunHash() {
  store.runHash = hashId++;
}
