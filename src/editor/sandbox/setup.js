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
        option: JSON.stringify(chart.getOption(), (key, val) => {
          if (echarts.util.isFunction(val) || typeof val === 'bigint') {
            return val.toString();
          }
          return val;
        }),
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
          store.darkMode ? 'dark' : store.theme,
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

      initInternalAPI(appEnv);

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
            'CDN_PATH',
            '__ECHARTS_EXAMPLE_RANDOM__',
            'top',
            'parent',
            'window',
            'self',
            'globalThis',
            'document',
            'location',
            'history',
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
            store.cdnPath,
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
            'CDN_PATH',
            '__ECHARTS_EXAMPLE_RANDOM__',
            runCode
          );

          res = func(
            chartInstance,
            appEnv,
            setTimeout,
            setInterval,
            store.cdnRoot,
            store.cdnPath,
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

        initDatGUITooltip(gui.domElement);

        const configParams = appEnv.configParameters || {};
        const config = appEnv.config;

        // If using seletion/options, dat.GUI always convert value into string. e.g., convert
        // `true`, `false` to `'true'`, `'false'`, or convert `10`, `20` to `'10'`, `'20'`.
        // This probably bothers users. Therefore, we need to convert it back to the raw value type.
        function revertToRawValueForOptions(datGUIController, datGUINewValue) {
          var name = datGUIController.property;
          var configVal = configParams[name];
          if (!configVal || !configVal.options || !config.hasOwnProperty(name)) {
            return;
          }
          // Considered `configVal.options` can be either
          // `[value1, value2, ...]` or `{key1: value2, key2: value2, ...}`.
          echarts.util.each(configVal.options, function (rawVal) {
            if ('' + rawVal === datGUINewValue) {
              config[name] = rawVal;
            }
          });
        }

        const onChange = config.onChange
          ? function (newValue) {
            revertToRawValueForOptions(this, newValue);
            config.onChange();
          }
          : null;
        const onFinishChange = config.onFinishChange
          ? function (newValue) {
            revertToRawValueForOptions(this, newValue);
            config.onFinishChange();
          }
          : null;

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
            onChange && controller.onChange(onChange);
            onFinishChange && controller.onFinishChange(onFinishChange);
          }
        } // End of `for (const name in config)`
      }
    }
  };

  /**
   * Add a tooltip for long label that truncated by dat.GUI.
   */
  function initDatGUITooltip(guiEl) {
    // Add a tooltip for long label that truncated by dat.GUI
    const tooltip = document.createElement('div');
    tooltip.className = 'dat-gui-tooltip';
    document.body.appendChild(tooltip);
    $(tooltip).css({
      display: 'none',
      position: 'absolute',
      zIndex: 9000,
      padding: '5px 10px',
      backgroundColor: '#333',
      color: '#fff',
      borderRadius: '4px',
      fontSize: '12px',
      pointerEvents: 'none',
    });

    guiEl.addEventListener('mouseover', function (ev) {
      const target = ev.target;
      if (!target) {
        return;
      }
      const labelText = $(target).filter('.property-name').add($(target).find('.property-name')).first().text();
      if (!labelText) {
        return;
      }
      $(tooltip).text(labelText);
      $(tooltip).css({
        display: 'block',
        left: ev.pageX + 10 + 'px',
        top: ev.pageY + 10 + 'px',
      });
    });

    guiEl.addEventListener('mouseout', function () {
      $(tooltip).css({display: 'none'});
    });

    guiEl.addEventListener('mousemove', function (ev) {
      tooltip.style.left = ev.pageX + 10 + 'px';
      tooltip.style.top = ev.pageY + 10 + 'px';
    });
  }

  /**
   * This is some features that requires echarts internal API.
   * Inappropriate to public to users for production usage, but useful in demo.
   * Usage in examples code:
   * ```js
   * app.__internalAPI.xxx(myChart, otherArgs);
   * ```
   */
  function initInternalAPI(appEnv) {
    const internalAPI = appEnv.__internalAPI = {};

    /**
     * @param {{
     *  mainType: ComponentMainType;
     *  subType?: ComponentSubType;
     *  index?: number | number[];
     *  id?: OptionId | OptionId[];
     *  name?: OptionName | OptionName[];
     * }} queryParam For example:
     *    {mainType: 'series', subType: 'map', id: 'xxx'}
     *    {mainType: 'geo', id: 'xxx'}
     */
    internalAPI.retrieveViewCoordSysRects = function (myChart, queryParam) {
      if (!queryParam
        || (
          queryParam.index == null
          && queryParam.id == null
          && queryParam.name == null
        )
      ) {
        throw new Error('queryParam must have either index, id or name.');
      }
      const component = myChart.getModel().queryComponents(queryParam)[0];
      if (!component) {
        throw new Error('No component found for the given queryParam.');
      }
      const viewCoordSys = component.coordinateSystem;
      if (!viewCoordSys) {
        throw new Error('The component does not have a view coordinate system.');
      }
      ecInternalAPIExistingCheck(viewCoordSys, 'getViewRect');
      ecInternalAPIExistingCheck(viewCoordSys, 'getBoundingRect');

      const viewRect = viewCoordSys.getViewRect().clone();
      const contentBoundingRect = viewCoordSys.getBoundingRect().clone();
      const trans = viewCoordSys.getComputedTransform();
      if (trans) {
        contentBoundingRect.applyTransform(trans);
      }
      return {
        viewRect,
        contentBoundingRect
      };
    };

    function ecInternalAPIExistingCheck(host, apiName) {
      if (!host[apiName]) {
        throw new Error(`The internal API \`${apiName}\` probably have breaking changes.`);
      }
    }
  }

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
