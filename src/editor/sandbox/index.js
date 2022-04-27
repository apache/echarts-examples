import srcdoc from './srcdoc.html';
import handleLoop from './handleLoop';
import setup from './setup';
import loopController from 'raw-loader!./loopController';
import showDebugDirtyRect from 'raw-loader!../../dep/showDebugDirtyRect';
import estraverse from 'raw-loader!./estraverse.browser';

export function createSandbox(
  container,
  scripts,
  onload,
  onerror,
  onCodeError,
  onOptionUpdated
) {
  scripts = scripts || [];
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
    [
      'allow-modals',
      'allow-pointer-lock',
      'allow-same-origin',
      'allow-scripts',
      'allow-downloads'
    ].join(' ')
  );
  sandbox.style.cssText = 'width:100%;height:100%;border:none;background:none';
  sandbox.srcdoc = srcdoc.replace(
    '<!--SCRIPTS-->',
    scripts
      .map((script) =>
        script.content
          ? `<script>${script.content}</script>`
          : `<script src="${script.src}"></script>`
      )
      .join('')
  );
  sandbox.onload = onload;
  sandbox.onerror = onerror;
  container.appendChild(sandbox);

  function hanldeMessage(e) {
    if (e.source !== sandbox.contentWindow) {
      return;
    }
    const evt = e.data.evt;
    console.log('event from sandbox', evt);
    switch (evt) {
      case 'optionUpdated':
        onOptionUpdated(e.data.option, e.data.updateTime);
        break;
      // case 'error':
      // case 'unhandledRejection':
      //   onerror();
      //   break;
      case 'codeError':
        onCodeError();
        break;
      default:
        break;
    }
  }

  function sendMessage(action, argumentMap) {
    sandbox.contentWindow.postMessage({ action, ...argumentMap }, '*');
  }

  function getChartInstance() {
    return sandbox.contentWindow.chartInstance;
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
      // sendMessage('getOption');
      const chart = getChartInstance();
      return chart && chart.getOption();
    }
  };
}
