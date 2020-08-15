<template>
<div>
    <div v-loading="loading"
        :class="['right-panel', inEditor ? '' : 'full']"
        id="chart-panel"
        :style="{background: backgroundColor}"
    ></div>
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
        <button v-if="inEditor" class="download btn btn-sm" @click="downloadExample">{{ $t('editor.download') }}</button>
        <a :href="editLink" target="_blank" v-else class="edit btn btn-sm">{{ $t('editor.edit') }}</a>
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
import CHART_LIST from '../data/chart-list-data';
import {download} from './downloadExample';

const example = CHART_LIST.find(item => URL_PARAMS.c === item.id);

export function ensureECharts() {
    if (typeof echarts === 'undefined') {

        const hasBmap = example && example.tags.indexOf('bmap') >= 0;

        // Code from https://api.map.baidu.com/api?v=2.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu
        if (hasBmap) {
            window.HOST_TYPE = "2";
            window.BMap_loadScriptTime = (new Date).getTime();
        }

        return loadScriptsAsync([
            SCRIPT_URLS.datGUIMinJS,
            URL_PARAMS.local
                ? SCRIPT_URLS.localEChartsMinJS : SCRIPT_URLS.echartsMinJS,
            SCRIPT_URLS.echartsDir + '/dist/extension/dataTool.js',
            SCRIPT_URLS.echartsDir + '/map/js/world.js',
            SCRIPT_URLS.echartsStatMinJS,
            ...URL_PARAMS.gl ? [SCRIPT_URLS.echartsGLMinJS] : [],
            ...hasBmap ? [
                'https://api.map.baidu.com/getscript?v=2.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&services=&t=20200327103013',
                SCRIPT_URLS.echartsDir + '/dist/extension/bmap.js'
            ] : []
        ]);
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
        this.sandbox = createSandbox((chart) => {
            const option = chart.getOption();
            if (typeof option.backgroundColor === 'string' && option.backgroundColor !== 'transparent') {
                this.backgroundColor = option.backgroundColor;
            }
            else {
                this.backgroundColor = '#fff';
            }
        });
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

    props: ['inEditor'],

    data() {
        return {
            shared: store,
            debouncedTime: undefined,
            backgroundColor: '',
            autoRun: true,
            loading: false
        }
    },

    mounted() {
        this.loading = true;
        ensureECharts().then(() => {
            this.loading = false;
            if (store.runCode) {
                this.run();
            }
        });

        addListener(this.$el, () => {
            if (this.sandbox) {
                this.sandbox.resize();
            }
        })
    },

    computed: {
        editLink() {
            const params = ['c=' + URL_PARAMS.c];
            if (URL_PARAMS.theme) {
                params.push(['theme=' + URL_PARAMS.theme]);
            }
            if (URL_PARAMS.gl) {
                params.push(['gl=' + URL_PARAMS.gl]);
            }
            return './editor.html?' + params.join('&');
        }
    },

    watch: {
        "shared.runCode"(val) {
            if (this.autoRun || !this.sandbox) {
                if (!this.debouncedRun) {
                    // First run
                    this.run();
                }
                else {
                    this.debouncedRun();
                }
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
        },
        downloadExample() {
            download();
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
    top: 42px;
    right: 15px;
    bottom: 15px;
    left: 15px;
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;

    padding: 10px;
}

#chart-panel.full {
    top: 40px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 5px;
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
    .el-radio-group {
        text-transform: uppercase;
    }

    .el-switch__label.is-active {
        color: #181432;
    }

    .el-radio-button--mini .el-radio-button__inner {
        padding: 5px 8px;
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

    .download, .edit {
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