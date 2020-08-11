<template>
<div>
    <div class="right-panel" id="chart-panel"></div>
    <div id="tool-panel">
        <ToggleButton></ToggleButton>
        <button id="download" class="btn btn-sm">Download</button>
    </div>
</div>
</template>

<script>

import {store} from '../common/store';
import {SCRIPT_URLS, URL_PARAMS} from '../common/config';
import {loadScriptsAsync} from '../common/helper';
import debounce from 'lodash.debounce';

function ensureECharts() {
    if (typeof ace === 'undefined') {
        return loadScriptsAsync([
            SCRIPT_URLS.datGUIMinJS,
            SCRIPT_URLS.echartsMinJS,
            SCRIPT_URLS.echartsDir + '/dist/extension/dataTool.js',
            SCRIPT_URLS.echartsStatMinJS,
            ...URL_PARAMS.gl ? [SCRIPT_URLS.echartsGLMinJS] : []
        ]).then(function () {
        })
    }
    return Promise.resolve();
}


let appEnv = {};
let gui;

let _intervalIdList = [];
let _timeoutIdList = [];

const _oldSetTimeout = window.setTimeout;
const _oldSetInterval = window.setInterval;

window.setTimeout = function (func, delay) {
    var id = _oldSetTimeout(func, delay);
    _timeoutIdList.push(id);
    return id;
};
window.setInterval = function (func, gap) {
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
var _events = [];
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

function log(text, type) {
    if (type !== 'warn' && type !== 'error') {
        type = 'info';
    }
    store.editorStatus.message = text;
    store.editorStatus.type = type;
}
function run() {
    if (typeof echarts === 'undefined') {
        return;
    }

    if (!this.chart) {
        this.chart = echarts.init(this.$el.querySelector('#chart-panel'), store.theme, {
            renderer: store.renderer
        });
        _wrapOnMethods(this.chart);
    }

    // if (this.hasEditorError()) {
    //     log(this.$t('editor.errorInEditor'), 'error');
    //     return;
    // }

    // TODO Scope the variables in component.
    _clearTimeTickers();
    _clearChartEvents(this.chart);
    // Reset
    appEnv.config = null;

    // run the code
    try {

        const myChart = this.chart;
        // FIXME
        const app = appEnv;

        // Reset option
        let option = null;
        let ROOT_PATH = store.cdnRoot;
        eval(store.code);

        if (option && typeof option === 'object') {
            const startTime = +new Date();
            myChart.setOption(option, true);
            const endTime = +new Date();
            const updateTime = endTime - startTime;

            if (updateTime > 1000) {
                // Disable auto run
                this.autoRun = false;
            }

            log(this.$t('editor.chartOK') + updateTime + 'ms');
        }

        if (gui) {
            $(gui.domElement).remove();
            gui.destroy();
            gui = null;
        }

        if (app.config) {
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

            var configParameters = app.configParameters || {};
            for (var name in app.config) {
                var value = app.config[name];
                if (name !== 'onChange' && name !== 'onFinishChange') {
                    var isColor = false;
                    // var value = obj;
                    var controller;
                    if (configParameters[name]) {
                        if (configParameters[name].options) {
                            controller = gui.add(app.config, name, configParameters[name].options);
                        }
                        else if (configParameters[name].min != null) {
                            controller = gui.add(app.config, name, configParameters[name].min, configParameters[name].max);
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
                        controller = gui[isColor ? 'addColor' : 'add'](app.config, name);
                    }
                    app.config.onChange && controller.onChange(app.config.onChange);
                    app.config.onFinishChange && controller.onFinishChange(app.config.onFinishChange);
                }
            }
        }
    } catch(e) {
        log(this.$t('editor.errorInEditor'), 'error');
        console.error(e);
    }
}

export default {

    data() {
        return {
            shared: store,
            autoRun: false
        }
    },

    mounted() {
        ensureECharts().then(() => {
            if (store.code) {
                this.run();
            }
        });
    },

    watch: {
        "shared.code"(val) {
            if (this.autoRun || !this.chart) {
                this.debouncedRun();
            }
        },
        "shared.renderer"() {
            this.refreshAll();
        },
        "shared.theme"() {
            this.refreshAll();
        }
    },

    methods: {
        run,
        debouncedRun: debounce(run, 500),
        refreshAll() {
            this.dispose();
            this.run();
        },
        dispose() {
            if (this.chart) {
                this.chart.dispose();
            }
            this.chart = null;
        }
        // hasEditorError() {
        //     const annotations = this.editor.getSession().getAnnotations();
        //     for (let aid = 0, alen = annotations.length; aid < alen; ++aid) {
        //         if (annotations[aid].type === 'error') {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
    }
}
</script>

<style lang="scss">

#chart-panel {
    position: absolute;
    // top: $control-panel-height;
    top: 15px;
    right: 15px;
    bottom: 60px;
    left: 15px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
}

#tool-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    #theme {
        margin-bottom: 10px;
        float: right;

        a {
            cursor: pointer;
        }
    }

    #download {
        float: right;
        margin-right: 10px;
    }
}

.dg.main * {
    box-sizing: content-box;
}
.dg.main input {
    line-height: normal;
}

.dg.main.a {
    overflow-x: visible;
}

.dg.main .c {
    select {
        color: #000;
    }
}

</style>