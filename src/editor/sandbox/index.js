import srcdoc from './srcdoc.html';
import estraverse from './estraverse.browser?raw-pure';
import loopController from './loopController?raw-minify';
import handleLoop from './handleLoop?raw-minify';
import showDebugDirtyRect from '../../dep/showDebugDirtyRect?raw-minify';
import setup from './setup?raw-minify';
import { store } from '../../common/store';
import { SCRIPT_URLS } from '../../common/config';

function prepareSetupScript(isShared) {
  const isProd = process.env.NODE_ENV === 'production';
  return [
    estraverse,
    loopController,
    [
      '(()=>{',
      handleLoop,
      showDebugDirtyRect,
      `(${setup})(${isShared})`,
      '})()'
    ].join(isProd ? '' : '\n\n')
  ].map((content) => ({ content }));
}

export function createSandbox(
  container,
  scripts,
  isShared,
  onload,
  onerror,
  onCodeError,
  onOptionUpdated,
  onCSSParsed
) {
  const commonLibs = [
    SCRIPT_URLS.jQueryJS,
    SCRIPT_URLS.seedrandomJS,
    SCRIPT_URLS.acornJS
  ].map((src) => ({ src }));
  scripts = commonLibs.concat(scripts, prepareSetupScript(isShared));

  const sandbox = document.createElement('iframe');
  const allow = [
    'allow-pointer-lock',
    'allow-scripts',
    'allow-downloads',
    'allow-same-origin'
  ];
  isShared ||
    allow.push(
      'allow-popups',
      'allow-popups-to-escape-sandbox',
      'allow-modals'
    );
  sandbox.setAttribute('sandbox', allow.join(' '));
  let csp;
  if (isShared) {
    csp = {
      'default-src': [
        `'self'`,
        `'unsafe-inline'`,
        `'unsafe-eval'`,
        'data:',
        'blob:'
      ].concat(
        (() => {
          const domains = [
            '*.apache.org',
            '*.jsdelivr.net',
            '*.jsdelivr.com',
            '*.unpkg.com',
            '*.baidu.com',
            '*.bdimg.com',
            '*.bdstatic.com',
            'apache.org',
            'apache.github.io',
            'jsdelivr.net',
            'jsdelivr.com',
            'unpkg.com',
            'baidu.com',
            'bdimg.com',
            'bdstatic.com',
            'cdnjs.cloudflare.com',
            'cdn.bootcdn.net',
            'lib.baomitu.com',
            'unpkg.zhimg.com',
            'npm.elemecdn.com'
          ];
          store.isPR && domains.push(`echarts-pr-${store.prNumber}.surge.sh`);
          return domains;
        })().map((domain) => 'https://' + domain)
      ),
      'frame-src': [`'none'`],
      'object-src': [`'none'`],
      'navigate-to': [`'none'`],
      'worker-src': [`'none'`]
    };
    csp = Object.entries(csp)
      .map(([key, val]) => `${key} ${val.join(' ')}`)
      .join('; ');
  }
  csp && sandbox.setAttribute('csp', csp);
  sandbox.srcdoc = srcdoc
    .replace('__LANG__', document.documentElement.lang || 'en')
    .replace('__CSP__', csp || '')
    .replace(
      '__SCRIPTS__',
      scripts
        .map((script) =>
          script.content
            ? `<script>${script.content}</script>`
            : `<script src="${script.src}"></script>`
        )
        .join('')
    );
  sandbox.style.cssText = 'width:100%;height:100%;border:none;background:none';
  sandbox.onload = () => {
    // FIXME
    // No good way to prevent the user from trying to redirect the iframe via `document.location.href = xxx`
    // This is a tricky way
    // `onload` will be triggered again after the iframe redirects
    // here we check and block it as we usually won't do this
    if (sandbox.__loaded__ && isShared) {
      const errorMsg = 'potential redirection from the code was blocked';
      console.error(errorMsg);
      onCodeError(errorMsg);
      onerror();
      return;
    }
    sandbox.__loaded__ = true;
    onload();
  };
  sandbox.onerror = onerror;
  container.appendChild(sandbox);

  function handleMessage(e) {
    if (e.source !== sandbox.contentWindow) {
      return;
    }
    const data = e.data;
    switch (data.evt) {
      case 'optionUpdated':
        sandbox.chartOption = JSON.parse(data.option);
        onOptionUpdated(data.updateTime);
        break;
      // case 'error':
      // case 'unhandledRejection':
      //   onerror();
      //   break;
      case 'codeError':
        onCodeError(data.message);
        break;
      case 'cssParsed':
        onCSSParsed(data.css);
        break;
      default:
        break;
    }
  }

  function sendMessage(action, argumentMap) {
    sandbox.contentWindow.postMessage({ action, ...argumentMap }, '*');
  }

  window.addEventListener('message', handleMessage, false);

  return {
    dispose() {
      sendMessage('dispose');
      window.removeEventListener('message', handleMessage);
      container.removeChild(sandbox);
    },
    run(store, recreateInstance) {
      sendMessage('run', { store, recreateInstance });
    },
    screenshot(filename) {
      sendMessage('screenshot', { filename });
    },
    getOption() {
      return sandbox.chartOption;
    }
  };
}
