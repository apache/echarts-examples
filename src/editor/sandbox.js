export function createSandbox() {
    let appEnv = {};
    let gui;

    let _intervalIdList = [];
    let _timeoutIdList = [];

    const _oldSetTimeout = window.setTimeout;
    const _oldSetInterval = window.setInterval;

    function setTimeout(func, delay) {
        var id = _oldSetTimeout(func, delay);
        _timeoutIdList.push(id);
        return id;
    };
    function setInterval(func, gap) {
        var id = _oldSetInterval(func, gap);
        _intervalIdList.push(id);
        return id;
    };
    function _clearTimeTickers() {
        for (var i = 0; i < _intervalIdList.length; i++) {
            clearInterval(_intervalIdList[i]);
        }
        for (var i = 0; i < _timeoutIdList.length; i++) {
            clearTimeout(_timeoutIdList[i]);
        }
        _intervalIdList = [];
        _timeoutIdList = [];
    }
    const _events = [];
    function _wrapOnMethods(chart) {
        var oldOn = chart.on;
        chart.on = function (eventName) {
            var res = oldOn.apply(chart, arguments);
            _events.push(eventName);
            return res;
        };
    }

    function _clearChartEvents(chart) {
        _events.forEach(function (eventName) {
            if (chart) {
                chart.off(eventName);
            }
        });

        _events.length = 0;
    }

    let chartInstance;

    return {
        resize() {
            if (chartInstance) {
                chartInstance.resize();
            }
        },

        dispose() {
            if (chartInstance) {
                chartInstance.dispose();
                chartInstance = null;
            }
        },

        run(el, store) {

            if (!chartInstance) {
                chartInstance = echarts.init(el, store.darkMode ? 'dark' : '', {
                    renderer: store.renderer
                });
                _wrapOnMethods(chartInstance);
            }

            // if (this.hasEditorError()) {
            //     log(this.$t('editor.errorInEditor'), 'error');
            //     return;
            // }

            // TODO Scope the variables in component.
            _clearTimeTickers();
            _clearChartEvents(chartInstance);
            // Reset
            appEnv.config = null;

            // run the code

            const func = new Function(
                'myChart', 'app', 'setTimeout', 'setInterval', 'ROOT_PATH',
                store.code + '\n' + 'return option'
            );
            const option = func(chartInstance, appEnv, setTimeout, setInterval, store.cdnRoot);
            let updateTime = 0;

            if (option && typeof option === 'object') {
                const startTime = +new Date();
                chartInstance.setOption(option, true);
                const endTime = +new Date();
                updateTime = endTime - startTime;
            }

            if (gui) {
                $(gui.domElement).remove();
                gui.destroy();
                gui = null;
            }

            if (appEnv.config) {
                gui = new dat.GUI({
                    autoPlace: false
                });
                $(gui.domElement).css({
                    position: 'absolute',
                    right: 5,
                    top: 0,
                    zIndex: 1000
                });
                $('.right-container').append(gui.domElement);

                var configParameters = appEnv.configParameters || {};
                for (var name in appEnv.config) {
                    var value = appEnv.config[name];
                    if (name !== 'onChange' && name !== 'onFinishChange') {
                        var isColor = false;
                        // var value = obj;
                        var controller;
                        if (configParameters[name]) {
                            if (configParameters[name].options) {
                                controller = gui.add(appEnv.config, name, configParameters[name].options);
                            }
                            else if (configParameters[name].min != null) {
                                controller = gui.add(appEnv.config, name, configParameters[name].min, configParameters[name].max);
                            }
                        }
                        if (typeof obj === 'string') {
                            try {
                                var colorArr = echarts.color.parse(value);
                                isColor = !!colorArr;
                                if (isColor) {
                                    value = echarts.color.stringify(colorArr, 'rgba');
                                }
                            }
                            catch (e) {}
                        }
                        if (!controller) {
                            controller = gui[isColor ? 'addColor' : 'add'](appEnv.config, name);
                        }
                        appEnv.config.onChange && controller.onChange(appEnv.config.onChange);
                        appEnv.config.onFinishChange && controller.onFinishChange(appEnv.config.onFinishChange);
                    }
                }
            }

            return updateTime;
        }
    };
};