import { store } from './store';
import { getScriptURLs } from './config';
import * as lz from 'lz-string';
import * as fflate from 'fflate';
import {
  uint8ArrayToBase64,
  base64ToUint8Array
} from '../dep/uint8array-polyfill';

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
  if (
    typeof prettier === 'undefined' ||
    typeof prettierPlugins === 'undefined'
  ) {
    const SCRIPT_URLS = getScriptURLs(store.locale);

    return loadScriptsAsync([
      SCRIPT_URLS.prettierDir + '/standalone.js',
      SCRIPT_URLS.prettierDir +
        (store.typeCheck ? '/parser-typescript.js' : '/parser-babel.js')
    ]);
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

export function compressStrLZString(str) {
  if (!str || !(str = str.trim())) {
    return;
  }
  return lz
    .compressToBase64(str)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

export function decompressStrLZString(str) {
  if (!str || !(str = str.trim())) {
    return;
  }
  return lz.decompressFromBase64(
    str
      .replace(/\-/g, '+') // Convert '-' to '+'
      .replace(/_/g, '/') // Convert '_' to '/'
  );
}

export function compressStrDeflate(str) {
  if (!str || !(str = str.trim())) {
    return;
  }
  const uint8Array = fflate.deflateSync(fflate.strToU8(str), {
    level: 9,
    mem: 12
  });
  return uint8Array.toBase64
    ? uint8Array.toBase64({
        alphabet: 'base64url',
        omitPadding: true
      })
    : uint8ArrayToBase64(uint8Array, {
        alphabet: 'base64url',
        omitPadding: true
      });
}

export function decompressStrDeflate(str) {
  if (!str || !(str = str.trim())) {
    return;
  }
  const uint8Array = Uint8Array.fromBase64
    ? Uint8Array.fromBase64(str, { alphabet: 'base64url' })
    : base64ToUint8Array(str, { alphabet: 'base64url' }).bytes;
  return fflate.strFromU8(fflate.inflateSync(uint8Array));
}

export function isTrustedOpener() {
  try {
    return (
      window.opener && window.opener.origin === 'https://echarts.apache.org'
    );
  } catch {
    // CORS
  }
}

export function decodeBase64(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
