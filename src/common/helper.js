import { store } from './store';
import { SCRIPT_URLS } from './config';

const promisesCache = {};

export function loadScriptsAsync(scripts) {
  return Promise.all(
    scripts.map(function (scriptUrl) {
      if (typeof scriptUrl === 'string') {
        scriptUrl = {
          url: scriptUrl,
          // TODO Not supported type
          type: scriptUrl.match(/\.css$/) ? 'css' : 'js'
        };
      }
      if (promisesCache[scriptUrl.url]) {
        return promisesCache[scriptUrl.url];
      }
      const promise = new Promise((resolve, reject) => {
        if (scriptUrl.type === 'js') {
          const script = document.createElement('script');
          script.src = scriptUrl.url;
          script.async = false;
          script.onload = function () {
            resolve();
          };
          script.onerror = function () {
            reject();
          };
          document.body.appendChild(script);
        } else if (scriptUrl.type === 'css') {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = scriptUrl.url;
          link.onload = function () {
            resolve();
          };
          link.onerror = function () {
            reject();
          };
          document.body.appendChild(link);
        }
      });
      promisesCache[scriptUrl.url] = promise;
      return promise;
    })
  );
}

export function downloadBlob(blob, fileName) {
  // for IE
  if (typeof window.navigator.msSaveBlob === 'function') {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    // should revoke the blob url after the download
    URL.revokeObjectURL(a.href);
  }
}

function ensurePrettier() {
  if (typeof prettier === 'undefined') {
    return loadScriptsAsync([
      SCRIPT_URLS.prettierDir + '/standalone.js',
      SCRIPT_URLS.prettierDir +
        (store.typeCheck ? '/parser-typescript.js' : '/parser-babel.js')
    ]).then(([_, parser]) => {});
  }
  return Promise.resolve();
}

export function formatCode(code) {
  return ensurePrettier().then(() => {
    return prettier.format(code, {
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
      semi: true,
      trailingComma: 'none',
      // tabWidth: +this.formatCodeSettings.tabSize,
      // printWidth: +this.formatCodeSettings.maxLineWidth,
      parser: store.typeCheck ? 'typescript' : 'babel',
      plugins: prettierPlugins
    });
  });
}
