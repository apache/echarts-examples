<template>
<div>
    <div class="right-panel" id="chart-panel"></div>
    <div id="tool-panel">
        <div class="left-panel">
            <label class="tool-label"></label>
            <el-switch
                v-model="shared.darkMode"
                active-color="#181432"
                :active-text="$t('editor.darkMode')"
                :inactive-text="''">
            </el-switch>

            <label class="tool-label">{{ $t('editor.renderer') }}</label>
            <el-radio-group v-model="shared.renderer" size="mini">
                <el-radio-button label="svg"></el-radio-button>
                <el-radio-button label="canvas"></el-radio-button>
            </el-radio-group>
        </div>
        <button id="download" class="btn btn-sm">{{ $t('editor.download') }}</button>
    </div>
</div>
</template>

<script>

import {store} from '../common/store';
import {SCRIPT_URLS, URL_PARAMS} from '../common/config';
import {loadScriptsAsync} from '../common/helper';
import {createSandbox} from './sandbox';
import debounce from 'lodash/debounce';
import { addListener, removeListener } from 'resize-detector';

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

        addListener(this.$el, () => {
            if (this.sandbox) {
                this.sandbox.resize();
            }
        })
    },

    watch: {
        "shared.code"(val) {
            if (this.autoRun || !this.sandbox) {
                this.debouncedRun && this.debouncedRun();
            }
        },
        "shared.renderer"() {
            this.refreshAll();
        },
        "shared.darkMode"() {
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
            if (this.sandbox) {
                this.sandbox.dispose();
            }
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
    top: 50px;
    right: 15px;
    bottom: 15px;
    left: 15px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
}

#tool-panel {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    padding-top: 5px;

    .el-switch__label * {
        font-size: 12px;
        text-transform: uppercase;
    }

    label {
        margin-bottom: 0;
        font-size: 12px;
    }

    .left-panel {
        float: left;
    }

    .left-panel>* {
        vertical-align: middle;
        display: inline-block;
    }

    .tool-label {
        font-weight: bold;
        text-transform: uppercase;
        margin-left: 20px;
    }

    #download {
        float: right;
        margin-right: 20px;
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