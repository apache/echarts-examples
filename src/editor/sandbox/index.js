import srcdoc from './srcdoc.html';
import handleLoop from './handleLoop';
import setup from './setup';
import loopController from 'raw-loader!./loopController';
import showDebugDirtyRect from 'raw-loader!../../dep/showDebugDirtyRect';
import estraverse from '!!raw-loader!./estraverse.browser';

export function createSandbox(
  container,
  scripts,
  onload,
  onerror,
  onCodeError,
  onOptionUpdated,
  onCSSParsed
) {
  scripts = (scripts && scripts.slice()) || [];
  scripts.push(
    { content: estraverse },
    { content: loopController },
    {
      content: `
        (function(){
          ${handleLoop}
          ${showDebugDirtyRect}
          ${setup}
          setup()
        })()
      `
    }
  );

  const sandbox = document.createElement('iframe');
  sandbox.setAttribute(
    'sandbox',
    ['allow-pointer-lock', 'allow-scripts', 'allow-downloads'].join(' ')
  );
  const csp = {
    'default-src': [
      `'self'`,
      `'unsafe-inline'`,
      `'unsafe-eval'`,
      'data:',
      'blob:',
      '*.apache.org',
      '*.jsdelivr.net',
      '*.jsdelivr.com',
      '*.unpkg.com',
      '*.baidu.com',
      '*.bdimg.com',
      'apache.org',
      'jsdelivr.net',
      'jsdelivr.com',
      'unpkg.com',
      'baidu.com',
      'bdimg.com',
      'cdnjs.cloudflare.com',
      'cdn.bootcdn.net',
      'lib.baomitu.com',
      'unpkg.zhimg.com',
      'npm.elemecdn.com'
    ],
    'frame-src': [`'self'`, '*.apache.org'],
    'object-src': [`'none'`]
  };
  sandbox.csp = Object.entries(csp)
    .map(([key, val]) => `${key} ${val.join(' ')}`)
    .join('; ');
  sandbox.srcdoc = srcdoc
    .replace('__CSP__', sandbox.csp)
    .replace(
      '<!--SCRIPTS-->',
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
    if (sandbox.__loaded__) {
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

  function hanldeMessage(e) {
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

  window.addEventListener('message', hanldeMessage, false);

  return {
    dispose() {
      sendMessage('dispose');
      window.removeEventListener('message', hanldeMessage);
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
