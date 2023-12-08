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
          trigger="click"
          v-if="!isGL && !(shared.isMobile && hasRandomData)"
        >
          <div class="render-config-container">
            <div class="cfg-renderer">
              <label class="tool-label">{{ $t('editor.renderer') }}</label>
              <el-radio-group
                v-model="shared.renderer"
                size="mini"
                style="text-transform: uppercase"
              >
                <el-radio-button label="svg" />
                <el-radio-button label="canvas" />
              </el-radio-group>
            </div>
            <el-switch
              v-if="shared.renderer === 'canvas'"
              v-model="shared.useDirtyRect"
              :active-text="$t('editor.useDirtyRect')"
              :inactive-text="''"
            />
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
          :class="{
            'is-nightly': nightly,
            'is-pr': shared.isPR || hasPRVersion
          }"
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
      <div class="left-buttons">
        <template v-if="inEditor && !shared.isMobile">
          <el-button
            icon="el-icon-download"
            size="mini"
            @click="download"
            :title="$t('editor.download') + ' (HTML)'"
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
          <el-button
            @click="share"
            icon="el-icon-share"
            size="mini"
            :title="$t('editor.share.tooltip')"
          >
            {{ $t('editor.share.title') }}
          </el-button>
        </template>
      </div>

      <div
        id="run-log"
        v-if="inEditor && !shared.isMobile && shared.editorStatus.message"
      >
        <span class="run-log-time">{{ shared.editorStatus.time }}</span>
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
  updateRunHash,
  isValidPRVersion
} from '../common/store';
import { getScriptURLs, URL_PARAMS } from '../common/config';
import { compressStr } from '../common/helper';
import { createSandbox } from './sandbox';
import debounce from 'lodash/debounce';
import { download } from './downloadExample';
import { gotoURL, getURL } from '../common/route';
import { gt, rcompare } from 'semver';

const example = getExampleConfig();
const isGL = 'gl' in URL_PARAMS || isGLExample();
const isLocal = 'local' in URL_PARAMS;
const isDebug = 'debug' in URL_PARAMS;
const hasBMap = example && example.tags.indexOf('bmap') >= 0;

function getScriptURL(link) {
  return isDebug || isLocal ? link.replace('.min.', '.') : link;
}

function getScripts(nightly) {
  const SCRIPT_URLS = getScriptURLs(store.locale);

  const echartsDirTpl =
    SCRIPT_URLS[
      isLocal
        ? 'localEChartsDir'
        : store.isPR
        ? 'prPreviewEChartsDir'
        : nightly
        ? 'echartsNightlyDir'
        : 'echartsDir'
    ];
  const echartsDir = store.isPR
    ? echartsDirTpl.replace('{{PR_NUMBER}}', store.prNumber)
    : echartsDirTpl.replace('{{version}}', store.echartsVersion);
  const code = store.runCode;

  return [
    echartsDir +
      getScriptURL(SCRIPT_URLS.echartsJS) +
      (store.isPR ? '?_=' + (store.prLatestCommit || Date.now()) : ''),
    ...(isGL
      ? [
          isLocal
            ? SCRIPT_URLS.localEChartsGLDir + '/dist/echarts-gl.js'
            : getScriptURL(SCRIPT_URLS.echartsGLJS)
        ]
      : []),
    ...(hasBMap || /coordinateSystem.*:.*['"]bmap['"]/g.test(code)
      ? [
          SCRIPT_URLS.bmapLibJS,
          echartsDir + getScriptURL(SCRIPT_URLS.echartsBMapJS)
        ]
      : []),
    ...(code.indexOf('ecStat.') > -1
      ? [getScriptURL(SCRIPT_URLS.echartsStatJS)]
      : []),
    ...(/map.*:.*['"]world['"]/g.test(code)
      ? [SCRIPT_URLS.echartsWorldMapJS]
      : []),
    ...(code.indexOf('app.config') > -1 ? [SCRIPT_URLS.datGUIMinJS] : [])
  ].map((url) => ({ src: url }));
}

function log(text, type) {
  if (type !== 'warn' && type !== 'error') {
    type = 'info';
  }
  const now = new Date();
  store.editorStatus.time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((t) => (t + '').padStart(2, '0'))
    .join(':');
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

  const scripts = getScripts(this.nightly);
  const ECScriptReg = /\/echarts(?:\.min)?\.js/;
  const scriptsChanged =
    !this.scripts ||
    scripts.some(
      (s) =>
        !ECScriptReg.test(s.src) &&
        this.scripts.findIndex((s1) => s1.src === s.src) === -1
    );

  if (!this.sandbox || scriptsChanged) {
    this.loading = true;
    let isFirstRun = true;
    this.dispose();
    this.sandbox = createSandbox(
      this.$refs.chartPanel,
      (this.scripts = scripts),
      store.isSharedCode,
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
      (errMsg) => {
        const infiniteLoopInEditor =
          errMsg && errMsg.indexOf('loop executes') > -1;
        const potentialRedirection =
          errMsg && errMsg.indexOf('potential redirection') > -1;
        log(
          this.$t(
            `editor.${
              infiniteLoopInEditor
                ? 'infiniteLoopInEditor'
                : potentialRedirection
                ? 'potentialRedirectionInEditor'
                : 'errorInEditor'
            }`
          ),
          'error'
        );
      },
      (updateTime) => {
        const option = this.getOption();
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
      },
      (css) => {
        this.css = css;
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
      nightly: false,

      hasPRVersion: false
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
      const url = this.getSharableURL(true);
      return './editor.html' + url.search;
    },
    versionList() {
      return this.nightly ? this.nightlyVersions : this.allEChartsVersions;
    },
    isNightlyVersion() {
      return store.echartsVersion && store.echartsVersion.indexOf('dev') > -1;
    },
    toolOptions() {
      const isCanvas = store.renderer === 'canvas';
      return {
        renderer: isCanvas ? null : store.renderer,
        useDirtyRect: store.useDirtyRect && isCanvas ? 1 : null,
        decal: store.enableDecal ? 1 : null,
        theme: store.darkMode ? 'dark' : null
      };
    }
  },

  watch: {
    'shared.runCode'() {
      if (this.autoRun || !this.sandbox) {
        if (!this.debouncedRun) {
          // First run
          this.run();
          // show share hint on first run if code is user-shared
          store.isSharedCode && this.showShareHint();
          // show PR hint on first run if it's based on PR
          store.isPR &&
            !this.prHintTimer &&
            (this.prHintTimer = setTimeout(
              this.showPRHint,
              store.isSharedCode ? 1e3 : 0
            ));
        } else {
          this.debouncedRun();
        }
      }
    },
    toolOptions: {
      handler: 'refresh',
      deep: true
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
    refresh() {
      this.run(true);
    },
    refreshAll() {
      // trigger reload
      this.scripts = null;
      this.run(true);
    },
    dispose() {
      if (this.sandbox) {
        this.sandbox.dispose();
        this.sandbox = null;
      }
    },
    download() {
      const url = this.getSharableURL(true);
      const isShared = store.isSharedCode || url.searchParams.has('code');
      const headers = [
        `\t${this.$t('editor.downloadSourceTip')} ${url.toString()}`
      ];
      isShared && headers.push('\t⚠ ' + this.$t('editor.share.hint'));
      download(headers.join('\n'));
    },
    screenshot() {
      this.sandbox &&
        this.sandbox.screenshot(
          (URL_PARAMS.c || Date.now()) +
            '.' +
            (store.renderer === 'svg' ? 'svg' : 'png')
        );
    },
    showPRHint() {
      this.$message({
        type: 'warning',
        message: this.$t('editor.pr.hint').replace('{{PR}}', store.prNumber),
        customClass: 'toast-declaration',
        duration: 8000,
        showClose: true
      });
    },
    showShareHint() {
      this.$message.closeAll();
      this.$message({
        type: 'warning',
        message: this.$t('editor.share.hint'),
        customClass: 'toast-declaration',
        duration: 8000,
        showClose: true
      });
    },
    getSharableURL(raw) {
      const params = {};
      if (store.initialCode !== store.sourceCode) {
        params.code = compressStr(store.sourceCode);
        params.enc = null;
      }
      return getURL(
        {
          ...this.toolOptions,
          ...params
        },
        raw
      );
    },
    share() {
      const ctx = this;
      if (ctx.isShareBusy) {
        return;
      }
      ctx.isShareBusy = true;
      const sharableURL = ctx.getSharableURL();
      if (sharableURL.length < 1e4) {
        return copyToClipboard(sharableURL);
      }
      // test whether the sharable URL is valid
      $.ajax({
        url: sharableURL,
        method: 'HEAD',
        complete(jqXHR) {
          const statusCode = jqXHR.status;
          if (statusCode === 413 || statusCode === 414 || statusCode === 431) {
            ctx.isShareBusy = false;
            ctx.$message.closeAll();
            ctx.$message({
              type: 'error',
              message: ctx.$t('editor.share.urlTooLong'),
              customClass: 'toast-declaration'
            });
          } else {
            copyToClipboard(sharableURL);
          }
        }
      });

      function copyToClipboard(url) {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            ctx.$message.closeAll();
            ctx.$message({
              type: 'success',
              message: ctx.$t('editor.share.success'),
              customClass: 'toast-declaration'
            });
          })
          // PENDING
          .catch((e) => {
            console.error('failed to write share url to the clipboard', e);
            window.open(url, '_blank');
          })
          .finally(() => {
            ctx.isShareBusy = false;
          });
      }
    },
    getOption() {
      return this.sandbox && this.sandbox.getOption();
    },
    changeVersion() {
      saveExampleCodeToLocal();
      setTimeout(() => {
        // no confirmation as we have saved the code to local storage
        window.__EDITOR_NO_LEAVE_CONFIRMATION__ = true;
        gotoURL({
          version: store.echartsVersion,
          pv: store.isPR ? URL_PARAMS.version : void 0,
          ...this.toolOptions
        });
      });
    },
    changeRandomSeed() {
      updateRandomSeed();
      gotoURL({ random: store.randomSeed }, true);
      this.run();
    },
    fetchVersionList() {
      const isZH = store.locale === 'zh';
      const server = isZH
        ? // speed up for China mainland. `data.jsdelivr.com` is very slow or unaccessible for some ISPs.
          'https://registry.npmmirror.com'
        : 'https://data.jsdelivr.com/v1/package/npm';

      const handleData = (data) => {
        if (isZH) {
          data.versions = Object.keys(data.versions).sort(rcompare);
          data.tags = data['dist-tags'];
        }
      };

      const prVersion = URL_PARAMS.pv;
      const hasPRVersion = (this.hasPRVersion = isValidPRVersion(prVersion));

      $.getJSON(`${server}/echarts`).done((data) => {
        handleData(data);

        if (isDebug) {
          console.log('echarts version data', data);
        }

        const versions = data.versions.filter(
          (version) =>
            version.indexOf('beta') < 0 &&
            version.indexOf('rc') < 0 &&
            version.indexOf('alpha') < 0 &&
            version.startsWith('5') // Only version 5.
        );
        this.allEChartsVersions = versions;

        // Use latest version
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
          store.echartsVersion === 'rc' && (store.echartsVersion = versions[0]);
        }

        hasPRVersion && versions.unshift(prVersion);
      });

      $.getJSON(`${server}/echarts-nightly`).done((data) => {
        handleData(data);

        if (isDebug) {
          console.log('echarts-nightly version data', data);
        }

        const {
          tags: { latest, next },
          versions
        } = data;
        const nextIdx = versions.indexOf(next);
        const latestIdx = versions.indexOf(latest);
        this.nightlyVersions = versions
          .slice(nextIdx, nextIdx + 10)
          .concat(versions.slice(latestIdx, latestIdx + 10));

        hasPRVersion && this.nightlyVersions.unshift(prVersion);
      });

      if (isDebug) {
        console.log(
          'echarts versions',
          this.allEChartsVersions,
          'nightly versions',
          this.nightlyVersions
        );
      }
    },
    getAssets() {
      return {
        scripts: this.scripts,
        css: this.css
      };
    }
  }
};
</script>

<style lang="scss">
@import '../style/color.scss';

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

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
  @include flex-center;

  user-select: none;

  > * {
    margin-left: 10px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .cfg-renderer {
    @include flex-center;
  }

  .tool-label {
    font-weight: bold;
    margin-right: 5px;
    margin-bottom: 0;
  }

  .el-radio-group {
    label {
      margin-bottom: 0;
    }
  }
}

#tool-panel {
  position: absolute;
  top: 5px;
  right: 15px;
  left: 15px;
  @include flex-center;

  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;

  user-select: none;

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

    &.is-nightly,
    &.is-pr {
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

  .dark-mode {
    margin-right: 5px;
  }

  .edit {
    margin-left: 5px;
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
    right: 5px;
    left: 5px;
  }
}

#preview-status {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 0 15px;
  font-size: 0.9rem;
  @include flex-center;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;

  .left-buttons {
    flex-shrink: 0;
  }

  #run-log {
    @include flex-center;
    font-size: 12px;
    margin-left: 10px;
    text-align: right;

    .run-log-time {
      color: $clr-text;
      margin-right: 10px;
      white-space: nowrap;
    }

    .run-log-type-info {
      color: $clr-text;
    }

    .run-log-type-warn {
      color: $clr-warn;
    }

    .run-log-type-error {
      color: $clr-error;
    }
  }
}

.el-message {
  &.toast-declaration {
    min-width: auto;
    z-index: 9999999 !important;

    .el-message__icon {
      font-size: 20px;
    }

    .el-message__content {
      padding-right: 20px;
      line-height: 1.25;
    }
  }
}
</style>
