<template>
  <div :class="[inEditor && !shared.isMobile ? '' : 'full']">
    <div
      v-loading="loading"
      class="right-panel"
      id="chart-panel"
      :style="{ background: backgroundColor }"
    >
      <div class="chart-container"></div>
    </div>
    <div id="tool-panel">
      <div class="left-panel">
        <el-switch
          class="dark-mode"
          v-model="shared.darkMode"
          active-color="#181432"
          :active-text="$t('editor.darkMode')"
          :inactive-text="''"
        >
        </el-switch>
        <el-switch
          v-if="!isGL"
          class="enable-decal"
          v-model="shared.enableDecal"
          :active-text="$t('editor.enableDecal')"
          :inactive-text="''"
        >
        </el-switch>
        <!-- Not display when random button is displayed on mobile devices. -->
        <el-popover
          placement="bottom"
          width="450"
          trigger="click"
          v-if="!isGL && !(shared.isMobile && hasRandomData)"
        >
          <div class="render-config-container">
            <el-row :gutter="2" type="flex" align="middle">
              <el-col :span="12">
                <label class="tool-label">{{ $t('editor.renderer') }}</label>
                <el-radio-group
                  v-model="shared.renderer"
                  size="mini"
                  style="text-transform: uppercase"
                >
                  <el-radio-button label="svg"></el-radio-button>
                  <el-radio-button label="canvas"></el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col :span="12">
                <el-switch
                  v-if="shared.renderer === 'canvas'"
                  v-model="shared.useDirtyRect"
                  :active-text="$t('editor.useDirtyRect')"
                  :inactive-text="''"
                >
                </el-switch>
              </el-col>
            </el-row>
          </div>
          <span class="render-config-trigger" slot="reference">
            <el-button size="mini">
              {{ $t('editor.renderCfgTitle')
              }}<i class="el-icon-setting el-icon--right"></i>
            </el-button>
          </span>
        </el-popover>
        <el-select
          v-if="shared.echartsVersion && !shared.isMobile"
          class="version-select"
          size="mini"
          id="choose-echarts-version"
          v-model="shared.echartsVersion"
          @change="changeVersion"
        >
          <el-option
            v-for="version in allEchartsVersions"
            :key="version"
            :label="version"
            :value="version"
          >
            {{ version }}
          </el-option>
        </el-select>
        <el-button
          class="random"
          v-if="hasRandomData"
          size="mini"
          @click="changeRandomSeed"
          >{{ $t('editor.randomData') }}</el-button
        >
      </div>

      <a
        :href="editLink"
        target="_blank"
        v-if="!inEditor"
        class="edit btn btn-sm"
        >{{ $t('editor.edit') }}</a
      >
    </div>

    <div id="preview-status">
      <div class="left">
        <template v-if="inEditor && !shared.isMobile">
          <el-button
            icon="el-icon-download"
            size="mini"
            @click="downloadExample"
          >
            {{ $t('editor.download') }}
          </el-button>
          <el-button
            @click="screenshot"
            icon="el-icon-camera-solid"
            size="mini"
          >
            {{ $t('editor.screenshot') }}
          </el-button>
        </template>
      </div>

      <div
        class="right"
        id="run-log"
        v-if="inEditor && !shared.isMobile && shared.editorStatus.message"
      >
        <span class="run-log-time">{{ currentTime }}</span>
        <span :class="'run-log-type-' + shared.editorStatus.type">{{
          shared.editorStatus.message
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getExampleConfig,
  isGLExample,
  saveExampleCodeToLocal,
  store,
  updateRandomSeed,
  updateRunHash
} from '../common/store';
import { SCRIPT_URLS, URL_PARAMS } from '../common/config';
import { loadScriptsAsync } from '../common/helper';
import { createSandbox } from './sandbox';
import debounce from 'lodash/debounce';
import { addListener } from 'resize-detector';
import { download } from './downloadExample';
import { gotoURL } from '../common/route';

const example = getExampleConfig();
const isGL = isGLExample();

function addDecalIfNecessary(option) {
  if (store.enableDecal) {
    option.aria = option.aria || {};
    option.aria.decal = option.aria.decal || {};
    option.aria.decal.show = true;
    option.aria.show = option.aria.enabled = true;
  }
}

export function ensureECharts() {
  if (typeof echarts === 'undefined') {
    const hasBmap = example && example.tags.indexOf('bmap') >= 0;
    const echartsDir = SCRIPT_URLS.echartsDir.replace(
      '{{version}}',
      store.echartsVersion
    );

    // Code from https://api.map.baidu.com/api?v=2.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu
    if (hasBmap) {
      window.HOST_TYPE = '2';
      window.BMap_loadScriptTime = new Date().getTime();
    }

    return loadScriptsAsync([
      SCRIPT_URLS.datGUIMinJS,
      'local' in URL_PARAMS
        ? SCRIPT_URLS.localEChartsMinJS
        : SCRIPT_URLS.echartsMinJS.replace('{{version}}', store.echartsVersion),
      'https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js',
      SCRIPT_URLS.echartsStatMinJS,
      ...(URL_PARAMS.gl ? [SCRIPT_URLS.echartsGLMinJS] : []),
      ...(hasBmap
        ? [
            'https://api.map.baidu.com/getscript?v=3.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&services=&t=20200327103013',
            echartsDir + '/dist/extension/bmap.js'
          ]
        : [])
    ]).then(() => {
      echarts.registerPreprocessor(addDecalIfNecessary);
    });
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
      if (
        typeof option.backgroundColor === 'string' &&
        option.backgroundColor !== 'transparent'
      ) {
        this.backgroundColor = option.backgroundColor;
      } else {
        this.backgroundColor = '#fff';
      }
    });
  }

  try {
    const updateTime = this.sandbox.run(
      this.$el.querySelector('.chart-container'),
      store
    );

    log(this.$t('editor.chartOK') + updateTime + 'ms');

    // Find the appropriate throttle time
    const debounceTime = 500;
    const debounceTimeQuantities = [0, 500, 2000, 5000, 10000];
    for (let i = debounceTimeQuantities.length - 1; i >= 0; i--) {
      const quantity = debounceTimeQuantities[i];
      const preferredDebounceTime = debounceTimeQuantities[i + 1] || 1000000;
      if (
        updateTime >= quantity &&
        this.debouncedTime !== preferredDebounceTime
      ) {
        this.debouncedRun = debounce(run, preferredDebounceTime, {
          trailing: true
        });
        this.debouncedTime = preferredDebounceTime;
        break;
      }
    }

    // Update run hash to let others known chart has been changed.
    updateRunHash();
  } catch (e) {
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
      loading: false,

      isGL,

      allEchartsVersions: []
    };
  },

  mounted() {
    this.loadECharts();

    addListener(this.$el, () => {
      if (this.sandbox) {
        this.sandbox.resize();
      }
    });

    $.getJSON('https://data.jsdelivr.com/v1/package/npm/echarts').done(
      (data) => {
        const versions = data.versions.filter(
          (version) =>
            version.indexOf('beta') < 0 &&
            version.indexOf('rc') < 0 &&
            version.indexOf('alpha') < 0 &&
            version.startsWith('5') // Only version 5.
        );
        this.allEchartsVersions = versions;

        // Use last version
        if (!store.echartsVersion || store.echartsVersion === '5') {
          store.echartsVersion = versions[0];
        }
      }
    );
  },

  computed: {
    hasRandomData() {
      return (
        this.shared.runCode && this.shared.runCode.indexOf('Math.random()') >= 0
      );
    },
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
    'shared.runCode'(val) {
      if (this.autoRun || !this.sandbox) {
        if (!this.debouncedRun) {
          // First run
          this.run();
        } else {
          this.debouncedRun();
        }
      }
    },
    'shared.renderer'() {
      this.refreshAll();
    },
    'shared.darkMode'() {
      this.refreshAll();
    },
    'shared.enableDecal'() {
      this.refreshAll();
    },
    'shared.useDirtyRect'() {
      this.refreshAll();
    }
  },

  methods: {
    run,
    // debouncedRun will be created at first run
    // debouncedRun: null,
    loadECharts() {
      this.loading = true;
      ensureECharts().then(() => {
        this.loading = false;
        if (store.runCode) {
          this.run();
        }
      });
    },
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
    },
    screenshot() {
      if (this.sandbox) {
        const url = this.sandbox.getDataURL();
        const $a = document.createElement('a');
        $a.download =
          URL_PARAMS.c + '.' + (store.renderer === 'svg' ? 'svg' : 'png');
        $a.target = '_blank';
        $a.href = url;
        const evt = new MouseEvent('click', {
          bubbles: true,
          cancelable: false
        });
        $a.dispatchEvent(evt);
      }
    },
    getOption() {
      return this.sandbox && this.sandbox.getOption();
    },
    changeVersion() {
      saveExampleCodeToLocal();
      setTimeout(() => {
        gotoURL(
          Object.assign({}, URL_PARAMS, {
            version: store.echartsVersion
          })
        );
      });
    },
    changeRandomSeed() {
      updateRandomSeed();
      gotoURL(
        {
          ...URL_PARAMS,
          random: store.randomSeed
        },
        true
      );
      this.run();
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
};
</script>

<style lang="scss">
@import '../style/color.scss';

#chart-panel {
  position: absolute;
  // top: $control-panel-height;
  top: 42px;
  right: 15px;
  bottom: 50px;
  left: 15px;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;

  padding: 10px;

  .ec-debug-dirty-rect-container {
    left: 10px !important;
    top: 10px !important;
    right: 10px !important;
    bottom: 10px !important;

    .ec-debug-dirty-rect {
      background-color: rgba(255, 0, 0, 0.2) !important;
      border: 1px solid red !important;
    }
  }

  .chart-container {
    position: relative;
    height: 100%;
  }
}

.render-config-container {
  .el-radio-group {
    label {
      margin-bottom: 0;
    }
  }
}

#tool-panel {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding-top: 5px;
  padding-left: 15px;

  * {
    font-size: 12px;
  }

  .render-config-trigger {
    cursor: pointer;
    font-weight: 500;
    margin-left: 10px;
  }
  .version-select {
    width: 80px;
    margin-left: 10px;
  }
  .random {
    margin-left: 10px;
  }

  label {
    margin-bottom: 0;
  }

  .left-panel {
    float: left;
  }

  .left-panel > * {
    vertical-align: middle;
    display: inline-block;
  }

  .tool-label {
    font-weight: bold;
    text-transform: uppercase;
    margin-left: 20px;
  }

  .edit {
    float: right;
    margin-right: 15px;
    cursor: pointer;
  }
}

.full {
  #chart-panel {
    top: 40px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    box-shadow: rgba(10, 9, 9, 0.1) 0px 0px 5px;
  }
  #tool-panel {
    padding-left: 5px;
    .download,
    .edit {
      margin-right: 5px;
    }
  }
}

#preview-status {
  overflow: hidden;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 30px;

  padding: 0 20px;

  // border-top: 1px solid $clr-border;
  font-size: 0.9rem;

  .screenshot,
  .download,
  .edit {
    margin-right: 15px;
    cursor: pointer;
  }
  .screenshot {
    margin-right: 5px;
    width: 25px;
    height: 25px;
    margin-top: 2px;
  }

  .left {
    float: left;
    & > * {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .right {
    float: right;
  }
  #run-log {
    line-height: 25px;
    .run-log-time {
      color: $clr-text;
      display: inline-block;
      margin-right: 10px;
      font-size: 12px;
    }

    .run-log-type-info {
      color: $clr-text;
      font-size: 12px;
    }

    .run-log-type-warn {
      color: $clr-warn;
    }

    .run-log-type-error {
      color: $clr-error;
    }
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
