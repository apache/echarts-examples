function setup(isShared) {
  const sendMessage = (payload) => parent.postMessage(payload, '*');

  const chartStyleEl = document.head.querySelector('#chart-styles');

  const intervalIdList = [];
  const timeoutIdList = [];

  const nativeSetTimeout = window.setTimeout;
  const nativeSetInterval = window.setInterval;

  function setTimeout(func, delay) {
    const id = nativeSetTimeout(func, delay);
    timeoutIdList.push(id);
    return id;
  }

  function setInterval(func, interval) {
    const id = nativeSetInterval(func, interval);
    intervalIdList.push(id);
    return id;
  }

  function clearTimers() {
    intervalIdList.forEach(clearInterval);
    timeoutIdList.forEach(clearTimeout);
    intervalIdList.length = 0;
    timeoutIdList.length = 0;
  }

  const chartEvents = [];

  function wrapChartMethods(chart) {
    const nativeOn = chart.on;
    const nativeSetOption = chart.setOption;

    chart.on = function (eventName) {
      const res = nativeOn.apply(chart, arguments);
      chartEvents.push(eventName);
      return res;
    };

    chart.setOption = function () {
      const startTime = performance.now();
      const res = nativeSetOption.apply(this, arguments);
      const endTime = performance.now();
      sendMessage({
        evt: 'optionUpdated',
        option: JSON.stringify(chart.getOption(), (key, val) =>
          echarts.util.isFunction(val) ? val + '' : val
        ),
        updateTime: endTime - startTime
      });
      return res;
    };
  }

  function clearChartEvents(chart) {
    chart && chartEvents.forEach(chart.off.bind(chart));
    chartEvents.length = 0;
  }

  let appStore;
  let chartInstance;
  let appEnv = {};
  let gui;

  let win;
  if (isShared) {
    // override some potentially dangerous API
    win = [
      'addEventListener',
      'removeEventListener',
      'atob',
      'btoa',
      'fetch',
      'getComputedStyle'
    ].reduce(
      (prev, curr) => {
        const val = window[curr];
        prev[curr] = echarts.util.isFunction(val) ? val.bind(window) : val;
        return prev;
      },
      {
        location: Object.freeze(JSON.parse(JSON.stringify(location))),
        document: (() => {
          const disallowedElements = [
            'script',
            'video',
            'audio',
            'iframe',
            'frame',
            'frameset',
            'embed',
            'object',
            // PENDING
            'foreignobject'
          ];
          const disallowedElementsMatcher = new RegExp(
            `<(${disallowedElements.join('|')}).*>`
          );
          const nativeSetters = {
            innerHTML: Object.getOwnPropertyDescriptor(
              Element.prototype,
              'innerHTML'
            ).set,
            outerHTML: Object.getOwnPropertyDescriptor(
              Element.prototype,
              'outerHTML'
            ).set,
            innerText: Object.getOwnPropertyDescriptor(
              HTMLElement.prototype,
              'innerText'
            ).set,
            outerText: Object.getOwnPropertyDescriptor(
              HTMLElement.prototype,
              'outerText'
            ).set
          };
          ['inner', 'outer'].forEach((prop) => {
            const htmlProp = prop + 'HTML';
            Object.defineProperty(Element.prototype, htmlProp, {
              set(value) {
                return (
                  disallowedElementsMatcher.test(value)
                    ? nativeSetters[prop + 'Text']
                    : nativeSetters[htmlProp]
                ).call(this, value);
              }
            });
          });
          const fakeDoc = document.cloneNode();
          // To enable the created elements to be inserted to body
          // Object.defineProperties(fakeDoc, {
          //   documentElement: {
          //     get() {
          //       return document.documentElement;
          //     }
          //   },
          //   body: {
          //     get() {
          //       return document.body;
          //     }
          //   }
          // });
          [
            ['write', document.write, 0, true],
            ['writeln', document.writeln, 0, true],
            ['createElement', document.createElement, 0],
            ['createElementNS', document.createElementNS, 1]
          ].forEach((api) => {
            const nativeFn = api[1];
            const argIndx = api[2];
            const fullTextSearch = api[3];
            fakeDoc[api[0]] = function () {
              let val = arguments[argIndx];
              val && (val = val.toLowerCase());
              if (
                val &&
                (fullTextSearch
                  ? ((val = val.match(disallowedElementsMatcher)),
                    (val = val && val[1]))
                  : disallowedElements.includes(val))
              ) {
                return console.error(
                  `Disallowed attempting to create ${val} element!`
                );
              }
              return nativeFn.apply(document, arguments);
            };
          });
          return fakeDoc;
        })(),
        history: void 0,
        parent: void 0,
        top: void 0,
        setTimeout,
        setInterval
      }
    );
    [
      'innerHeight',
      'outerHeight',
      'innerWidth',
      'outerWidth',
      'devicePixelRatio',
      'screen'
    ].forEach((prop) => {
      Object.defineProperty(win, prop, {
        get() {
          return window[prop];
        }
      });
    });
    win.self = win.window = win.globalThis = win;
  }

  const api = {
    dispose() {
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
        appStore = null;
      }
    },

    screenshot({ filename }) {
      const dataURL = chartInstance.getDataURL({
        excludeComponents: ['toolbox']
      });
      const $a = document.createElement('a');
      $a.download = filename;
      $a.target = '_blank';
      $a.href = dataURL;
      $a.click();
    },

    run({ store, recreateInstance }) {
      if (recreateInstance || !chartInstance || chartInstance.isDisposed()) {
        this.dispose();
        chartInstance = echarts.init(
          document.getElementById('chart-container'),
          store.darkMode ? 'dark' : '',
          {
            renderer: store.renderer,
            useDirtyRect: store.useDirtyRect
          }
        );
        if (store.useDirtyRect && store.renderer === 'canvas') {
          try {
            showDebugDirtyRect(chartInstance.getZr(), {
              autoHideDelay: 500
            });
          } catch (e) {
            console.error('failed to show debug dirty rect', e);
          }
        }
        window.addEventListener('resize', () => {
          chartInstance.resize();
          echarts.util.isFunction(appEnv.onresize) && appEnv.onresize();
        });
        wrapChartMethods(chartInstance);
      }

      // TODO Scope the variables in component.
      clearTimers();
      clearChartEvents(chartInstance);
      // Reset
      appEnv = {};
      appStore = store;

      try {
        // run the code
        const compiledCode = store.runCode
          // Replace random method
          .replace(/Math.random\([^)]*\)/g, '__ECHARTS_EXAMPLE_RANDOM__()');
        const echartsExampleRandom = new Math.seedrandom(store.randomSeed);
        // PENDING: create a single panel for CSS code?
        const runCode =
          'var css, option;' +
          handleLoop(compiledCode) +
          '\nreturn [option, css];';

        let func;
        let res;

        if (isShared) {
          func = new Function(
            'myChart',
            'app',
            'setTimeout',
            'setInterval',
            'ROOT_PATH',
            '__ECHARTS_EXAMPLE_RANDOM__',
            'top',
            'parent',
            'window',
            'self',
            'globalThis',
            'document',
            'location',
            'histroy',
            'eval',
            'execScript',
            'Function',
            runCode
          ).bind(win);

          res = func(
            chartInstance,
            appEnv,
            setTimeout,
            setInterval,
            store.cdnRoot,
            echartsExampleRandom,
            // prevent someone from trying to close the parent window via top/parent.close()
            // or any other unexpected and dangerous behaviors
            void 0,
            void 0,
            win,
            win,
            win,
            win.document,
            win.location,
            void 0,
            void 0,
            void 0,
            void 0
          );
        } else {
          func = new Function(
            'myChart',
            'app',
            'setTimeout',
            'setInterval',
            'ROOT_PATH',
            '__ECHARTS_EXAMPLE_RANDOM__',
            runCode
          );

          res = func(
            chartInstance,
            appEnv,
            setTimeout,
            setInterval,
            store.cdnRoot,
            echartsExampleRandom
          );
        }

        const css = (chartStyleEl.textContent = res[1] || '');
        sendMessage({
          evt: 'cssParsed',
          css
        });

        const option = res[0];
        echarts.util.isObject(option) && chartInstance.setOption(option, true);
      } catch (e) {
        // PENDING: prevent chart can't be updated once error occurs
        chartInstance.__flagInMainProcess = false;
        console.error('failed to run code', e);
        sendMessage({ evt: 'codeError', message: e.message });
      }

      if (gui) {
        $(gui.domElement).remove();
        gui.destroy();
        gui = null;
      }

      if (appEnv.config) {
        gui = new dat.GUI({ autoPlace: false });
        $(gui.domElement).css({
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1000
        });
        document.body.append(gui.domElement);

        const configParams = appEnv.configParameters || {};
        const config = appEnv.config;
        for (const name in config) {
          const value = config[name];
          if (name !== 'onChange' && name !== 'onFinishChange') {
            let isColor;
            let controller;
            const configVal = configParams[name];
            if (configVal) {
              if (configVal.options) {
                controller = gui.add(config, name, configVal.options);
              } else if (configVal.min != null) {
                controller = gui.add(
                  config,
                  name,
                  configVal.min,
                  configVal.max
                );
              }
            }
            if (typeof value === 'string') {
              try {
                const colorArr = echarts.color.parse(value);
                if ((isColor = !!colorArr)) {
                  value = echarts.color.stringify(colorArr, 'rgba');
                }
              } catch (e) {}
            }
            if (!controller) {
              controller = gui[isColor ? 'addColor' : 'add'](config, name);
            }
            config.onChange && controller.onChange(config.onChange);
            config.onFinishChange &&
              controller.onFinishChange(config.onFinishChange);
          }
        }
      }
    }
  };

  echarts.registerPreprocessor(function (option) {
    if (appStore.enableDecal) {
      option.aria = option.aria || {};
      option.aria.decal = option.aria.decal || {};
      option.aria.decal.show = true;
      option.aria.show = option.aria.enabled = true;
    }
  });

  function handleMessage(ev) {
    // const { action, ...args } = ev.data;
    const action = ev.data.action;
    delete ev.data.action;
    typeof api[action] === 'function' && api[action].apply(api, [ev.data]);
  }

  window.addEventListener('message', handleMessage, false);
  window.addEventListener('error', function () {
    sendMessage({ evt: 'error' });
  });
  window.addEventListener('unhandledrejection', function () {
    sendMessage({ evt: 'unhandledRejection' });
  });
}
