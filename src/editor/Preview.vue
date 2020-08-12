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
import {createSandbox} from './sandbox';
import debounce from 'lodash/debounce';


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
    if (!this.sandbox) {
        this.sandbox = createSandbox(log);
    }

    try {
        const updateTime = this.sandbox.run(this.$el.querySelector('#chart-panel'), store);

        log(this.$t('editor.chartOK') + updateTime + 'ms');

        // Find the appropriate throttle time
        const debounceTime = 500;
        const debounceTimeQuantities = [0, 500, 2000, 5000, 10000];
        for (let i = debounceTimeQuantities.length - 1; i >= 0; i--) {
            const quantity = debounceTimeQuantities[i];
            const preferredDebounceTime = debounceTimeQuantities[i + 1] || 1000000;
            if (updateTime >= quantity && this.debouncedTime !== preferredDebounceTime) {
                this.debouncedRun = debounce(run, preferredDebounceTime, {
                    trailing: true
                });
                this.debouncedTime = preferredDebounceTime;
                break;
            }
        }
    }
    catch (e) {
        log(this.$t('editor.errorInEditor'), 'error');
        console.error(e);
    }
}

export default {

    data() {
        return {
            shared: store,
            debouncedTime: undefined,
            autoRun: true
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
            if (this.autoRun || !this.sandbox) {
                console.log(this.debouncedRun);
                this.debouncedRun && this.debouncedRun();
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
        // debouncedRun will be created at first run
        // debouncedRun: null,
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