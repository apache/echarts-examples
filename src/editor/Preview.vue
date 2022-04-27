<template>
  <div :class="[inEditor && !shared.isMobile ? '' : 'full']">
    <div
      v-loading="loading"
      class="right-panel"
      id="chart-panel"
      ref="chartPanel"
      :style="{ background: backgroundColor }"
    ></div>
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
        <el-button
          class="random"
          v-if="hasRandomData"
          size="mini"
          @click="changeRandomSeed"
          >{{ $t('editor.randomData') }}</el-button
        >
        <el-select
          v-if="shared.echartsVersion && !shared.isMobile"
          class="version-select"
          :class="{ nightly }"
          size="mini"
          id="choose-echarts-version"
          v-model="shared.echartsVersion"
          @change="changeVersion"
        >
          <el-option
            v-for="version in versionList"
            :key="version"
            :label="version"
            :value="version"
          >
            {{ version }}
          </el-option>
        </el-select>
        <el-checkbox
          v-if="inEditor && !shared.isMobile"
          v-model="nightly"
          class="use-nightly"
          >Nightly</el-checkbox
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
          <el-button icon="el-icon-download" size="mini" @click="download">
            {{ $t('editor.download') }}
          </el-button>
          <el-button
            @click="screenshot"
            icon="el-icon-camera-solid"
            size="mini"
          >
            {{ $t('editor.screenshot') }}
          </el-button>
          <el-button @click="share" icon="el-icon-share" size="mini">
            {{ $t('editor.share.title') }}
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
import { compressStr } from '../common/helper';
import { createSandbox } from './sandbox';
import debounce from 'lodash/debounce';
import { download } from './downloadExample';
import { gotoURL } from '../common/route';
import { gt } from 'semver';

const example = getExampleConfig();
const isGL = 'gl' in URL_PARAMS || isGLExample();
const isLocal = 'local' in URL_PARAMS;
const isDebug = 'debug' in URL_PARAMS;
const hasBMap = example && example.tags.indexOf('bmap') >= 0;

function getScriptURL(link) {
  return isDebug || isLocal ? link.replace('.min.', '') : link;
}

function getScripts(nightly) {
  const echartsDir = SCRIPT_URLS[
    nightly && !isLocal ? 'echartsNightlyDir' : 'echartsDir'
  ].replace('{{version}}', store.echartsVersion);

  return [
    echartsDir + getScriptURL(SCRIPT_URLS.echartsJS),
    ...(isGL
      ? [
          isLocal
            ? SCRIPT_URLS.localEChartsGLJS
            : getScriptURL(SCRIPT_URLS.echartsGLJS)
        ]
      : []),
    ...(hasBMap
      ? [
          SCRIPT_URLS.bmapLibJS,
          echartsDir + getScriptURL(SCRIPT_URLS.echartsBMapJS)
        ]
      : []),
    getScriptURL(SCRIPT_URLS.echartsStatJS),
    SCRIPT_URLS.echartsWorldMapJS,
    SCRIPT_URLS.datGUIMinJS
  ].map((url) => ({ src: url }));
}

function log(text, type) {
  if (type !== 'warn' && type !== 'error') {
    type = 'info';
  }
  store.editorStatus.message = text;
  store.editorStatus.type = type;
}

function run(recreateInstance) {
  if (!store.runCode) {
    return;
  }

  const runCode = () => {
    this.sandbox.run(store, recreateInstance);

    // Update run hash to let others known chart has been changed.
    updateRunHash();
  };

  if (!this.sandbox) {
    this.loading = true;
    let isFirstRun = true;
    this.sandbox = createSandbox(
      this.$refs.chartPanel,
      getScripts(this.nightly),
      () => {
        runCode();
        this.loading = false;
      },
      () => {
        // TODO show error hints
        console.error('failed to run sandbox');
        this.loading = false;
        this.dispose();
      },
      () => {
        log(this.$t('editor.errorInEditor'), 'error');
      },
      (option, updateTime) => {
        if (
          typeof option.backgroundColor === 'string' &&
          option.backgroundColor !== 'transparent'
        ) {
          this.backgroundColor = option.backgroundColor;
        } else {
          this.backgroundColor = '#fff';
        }

        log(this.$t('editor.chartOK') + updateTime.toFixed(2) + 'ms');

        // Find the appropriate throttle time
        const debounceTimeQuantities = [0, 500, 2000, 5000, 10000];
        for (let i = debounceTimeQuantities.length - 1; i >= 0; i--) {
          const quantity = debounceTimeQuantities[i];
          const preferredDebounceTime =
            debounceTimeQuantities[i + 1] || 1000000;
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

        if (isFirstRun) {
          this.$emit('ready');
          isFirstRun = false;
        }
      }
    );
  } else {
    runCode();
  }
}

export default {
  props: {
    inEditor: {
      type: Boolean
    }
  },

  data() {
    return {
      shared: store,
      debouncedTime: undefined,
      backgroundColor: '',
      autoRun: true,
      loading: false,

      isGL,

      allEChartsVersions: [],
      nightlyVersions: [],
      nightly: false
    };
  },

  mounted() {
    this.run();

    this.fetchVersionList();
  },

  computed: {
    hasRandomData() {
      return (
        this.shared.runCode && this.shared.runCode.indexOf('Math.random()') >= 0
      );
    },
    editLink() {
      return './editor.html' + location.search;
    },
    versionList() {
      return this.nightly ? this.nightlyVersions : this.allEChartsVersions;
    },
    isNightlyVersion() {
      return store.echartsVersion && store.echartsVersion.indexOf('dev') > -1;
    }
  },

  watch: {
    'shared.runCode'() {
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
    },
    isNightlyVersion: {
      handler(val) {
        this.nightly = val;
      },
      immediate: true
    }
  },

  methods: {
    run,
    // debouncedRun will be created at first run
    // debouncedRun: null,
    refreshAll() {
      this.run(true);
    },
    dispose() {
      if (this.sandbox) {
        this.sandbox.dispose();
        this.sandbox = null;
      }
    },
    download,
    screenshot() {
      this.sandbox &&
        this.sandbox.screenshot(
          (URL_PARAMS.c || Date.now()) +
            '.' +
            (store.renderer === 'svg' ? 'svg' : 'png')
        );
    },
    share() {
      let shareURL = new URL(location.href);
      if (store.initialCode !== store.sourceCode) {
        shareURL.searchParams.set('code', compressStr(store.sourceCode));
      }
      navigator.clipboard
        .writeText(shareURL.toString())
        .then(() => this.$message.success(this.$t('editor.share.success')))
        // PENDING
        .catch((e) => {
          console.error('failed to write share url to the clipboard', e);
          window.open(shareURL, '_blank');
        });
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
    },
    // hasEditorError() {
    //     const annotations = this.editor.getSession().getAnnotations();
    //     for (let aid = 0, alen = annotations.length; aid < alen; ++aid) {
    //         if (annotations[aid].type === 'error') {
    //             return true;
    //         }
    //     }
    //     return false;
    // },
    fetchVersionList() {
      $.getJSON('https://data.jsdelivr.com/v1/package/npm/echarts').done(
        (data) => {
          const versions = data.versions.filter(
            (version) =>
              version.indexOf('beta') < 0 &&
              version.indexOf('rc') < 0 &&
              version.indexOf('alpha') < 0 &&
              version.startsWith('5') // Only version 5.
          );
          this.allEChartsVersions = versions;

          // Use lastest version
          if (
            !store.echartsVersion ||
            store.echartsVersion === '5' ||
            store.echartsVersion === 'latest'
          ) {
            store.echartsVersion = versions[0];
          }

          // put latest rc version for preview
          if (gt(data.tags.rc.split('-')[0], data.tags.latest)) {
            versions.unshift(data.tags.rc);
            store.echartsVersion === 'rc' &&
              (store.echartsVersion = versions[0]);
          }
        }
      );
      $.getJSON(
        'https://data.jsdelivr.com/v1/package/npm/echarts-nightly'
      ).done(({ tags: { latest, next }, versions }) => {
        const nextIdx = versions.indexOf(next);
        const latestIdx = versions.indexOf(latest);
        this.nightlyVersions = versions
          .slice(nextIdx, nextIdx + 10)
          .concat(versions.slice(latestIdx, latestIdx + 10));
      });
    }
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

    &.nightly {
      width: 160px;
    }
  }
  .random,
  .use-nightly {
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
