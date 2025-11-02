<template>
  <div :class="[inEditor && !shared.isMobile ? '' : 'full']">
    <div id="tool-panel">
      <div class="left-panel">
        <el-switch
          class="dark-mode"
          v-model="shared.darkMode"
          active-color="#181432"
          :active-text="t('editor.darkMode')"
          :inactive-text="''"
        >
        </el-switch>
        <el-switch
          v-if="!isGL"
          class="enable-decal"
          v-model="shared.enableDecal"
          :active-text="t('editor.enableDecal')"
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
              <label class="tool-label">{{ t('editor.renderer') }}</label>
              <el-radio-group
                v-model="shared.renderer"
                size="small"
                style="text-transform: uppercase"
              >
                <el-radio-button label="svg" />
                <el-radio-button label="canvas" />
              </el-radio-group>
            </div>
            <el-switch
              v-if="shared.renderer === 'canvas'"
              v-model="shared.useDirtyRect"
              :active-text="t('editor.useDirtyRect')"
              :inactive-text="''"
            />
          </div>
          <template #reference>
            <span class="render-config-trigger">
              <el-button size="small">
                {{ t('editor.renderCfgTitle')
                }}<i class="el-icon-setting el-icon--right"></i>
              </el-button>
            </span>
          </template>
        </el-popover>
        <el-button
          class="random"
          v-if="hasRandomData"
          size="small"
          @click="changeRandomSeed"
          >{{ t('editor.randomData') }}</el-button
        >
        <!-- TODO CSP 问题 -->
        <!-- <el-select
          v-if="shared.echartsVersion && !shared.isMobile"
          class="version-select"
          :class="{
            'is-nightly': nightly,
            'is-pr': shared.isPR || hasPRVersion
          }"
          size="small"
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
        </el-select> -->
        <!-- <el-checkbox
          v-if="inEditor && !shared.isMobile"
          v-model="nightly"
          class="use-nightly"
          >Nightly</el-checkbox
        > -->
      </div>

      <a
        :href="editLink"
        target="_blank"
        v-if="!inEditor"
        class="edit btn btn-sm"
        >{{ t('editor.edit') }}</a
      >
    </div>
    <div
      v-loading="loading"
      class="right-panel"
      id="chart-panel"
      ref="chartPanel"
      :style="{ background: backgroundColor }"
    ></div>
    <div id="preview-status">
      <div class="left-buttons">
        <template v-if="inEditor && !shared.isMobile">
          <el-button
            icon="el-icon-download"
            size="small"
            @click="downloadExample"
            :title="t('editor.download') + ' (HTML)'"
          >
            {{ t('editor.download') }}
          </el-button>
          <el-button
            @click="screenshot"
            icon="el-icon-camera-solid"
            size="small"
          >
            {{ t('editor.screenshot') }}
          </el-button>
          <el-button
            @click="share"
            icon="el-icon-share"
            size="small"
            :title="t('editor.share.tooltip')"
          >
            {{ t('editor.share.title') }}
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

<script setup>
import { ElMessage } from 'element-plus';
import debounce from 'lodash/debounce';
import { gt, rcompare } from 'semver';
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
  useTemplateRef,
  watch
} from 'vue';
import { useI18n } from 'vue-i18n';
import { getScriptURLs, URL_PARAMS } from '../common/config';
import { compressStr } from '../common/helper';
import { getURL, gotoURL } from '../common/route';
import {
  getExampleConfig,
  isGLExample,
  isValidPRVersion,
  saveExampleCodeToLocal,
  store,
  updateRandomSeed,
  updateRunHash
} from '../common/store';
import { download } from './downloadExample';
import { createSandbox } from './sandbox';

const { t } = useI18n();

const { inEditor } = defineProps({
  inEditor: {
    type: Boolean
  }
});

const emit = defineEmits(['ready']);

const example = getExampleConfig();
const isGL = ref('gl' in URL_PARAMS || isGLExample());
const isLocal = 'local' in URL_PARAMS;
const isDebug = 'debug' in URL_PARAMS;
const hasBMap = example && example.tags.indexOf('bmap') >= 0;

const shared = reactive(store);

const chartPanelRef = useTemplateRef('chartPanel');

const debouncedTime = ref(undefined);
const backgroundColor = ref('');
const autoRun = ref(true);
const loading = ref(false);
const allEChartsVersions = ref([]);
const nightlyVersions = ref([]);
const nightly = ref(false);
const hasPRVersion = ref(false);
const scripts = ref(null);
const sandbox = ref(null);
const debouncedRun = ref(null);
const css = ref('');
const prHintTimer = ref(null);
const isShareBusy = ref(false);

function getScriptURL(link) {
  return isDebug || isLocal ? link.replace('.min.', '.') : link;
}

function getScripts(isNightly) {
  const SCRIPT_URLS = getScriptURLs(shared.locale);

  const echartsDirTpl =
    SCRIPT_URLS[
      isLocal
        ? 'localEChartsDir'
        : shared.isPR
        ? 'prPreviewEChartsDir'
        : isNightly
        ? 'echartsNightlyDir'
        : 'echartsDir'
    ];

  // TODO CSP 问题
  // const echartsDir = store.isPR
  //   ? echartsDirTpl.replace('{{PR_NUMBER}}', store.prNumber)
  //   : echartsDirTpl.replace('{{version}}', store.echartsVersion);
  const echartsDir = isLocal
    ? SCRIPT_URLS.localEChartsDir
    : SCRIPT_URLS.latestEChartsDir;

  const code = shared.runCode;

  return [
    // echarts
    echartsDir +
      getScriptURL(SCRIPT_URLS.echartsJS) +
      (shared.isPR ? '?_=' + (shared.prLatestCommit || Date.now()) : ''),
    // echarts-gl
    ...(isGL
      ? [
          isLocal
            ? SCRIPT_URLS.localEChartsGLDir + '/dist/echarts-gl.js'
            : getScriptURL(SCRIPT_URLS.echartsGLJS)
        ]
      : []),
    // echarts theme
    ...(!shared.darkMode && shared.theme
      ? [echartsDir + `/theme/${shared.theme}.js`]
      : []),
    // echarts bmap extension
    ...(hasBMap || /coordinateSystem.*:.*['"]bmap['"]/g.test(code)
      ? [
          SCRIPT_URLS.bmapLibJS,
          echartsDir + getScriptURL(SCRIPT_URLS.echartsBMapJS)
        ]
      : []),
    // echarts stat
    ...(code.indexOf('ecStat') > -1
      ? [getScriptURL(SCRIPT_URLS.echartsStatJS)]
      : []),
    // echarts graph modularity
    ...(code.indexOf('graph') > -1 && code.indexOf('modularity') > -1
      ? [getScriptURL(SCRIPT_URLS.echartsGraphModularityJS)]
      : []),
    // echarts map
    ...(/map.*:.*['"]world['"]/g.test(code)
      ? [SCRIPT_URLS.echartsWorldMapJS]
      : []),
    // data gui
    ...(code.indexOf('app.config') > -1 ? [SCRIPT_URLS.datGUIMinJS] : [])
  ].map((url) => ({ src: url }));
}

function log(text, type) {
  if (type !== 'warn' && type !== 'error') {
    type = 'info';
  }
  const now = new Date();
  shared.editorStatus.time = [
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ]
    .map((t) => (t + '').padStart(2, '0'))
    .join(':');
  shared.editorStatus.message = text;
  shared.editorStatus.type = type;
}

function run(recreateInstance) {
  if (!shared.runCode) {
    return;
  }

  const runCode = () => {
    sandbox.value.run(toRaw(shared), recreateInstance);
    // Update run hash to let others known chart has been changed.
    updateRunHash();
  };

  const scriptsVal = getScripts(nightly.value);
  const ECScriptReg = /\/echarts(?:\.min)?\.js/;
  const scriptsChanged =
    !scripts.value ||
    scriptsVal.some(
      (s) =>
        !ECScriptReg.test(s.src) &&
        scripts.value.findIndex((s1) => s1.src === s.src) === -1
    );

  if (!sandbox.value || scriptsChanged) {
    loading.value = true;
    let isFirstRun = true;
    dispose();
    sandbox.value = createSandbox(
      chartPanelRef.value,
      (scripts.value = scriptsVal),
      shared.isSharedCode,
      () => {
        runCode();
        loading.value = false;
      },
      () => {
        // TODO show error hints
        console.error('failed to run sandbox');
        loading.value = false;
        dispose();
      },
      (errMsg) => {
        const infiniteLoopInEditor =
          errMsg && errMsg.indexOf('loop executes') > -1;
        const potentialRedirection =
          errMsg && errMsg.indexOf('potential redirection') > -1;
        log(
          t(
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
        const option = getOption();
        if (
          typeof option.backgroundColor === 'string' &&
          option.backgroundColor !== 'transparent'
        ) {
          backgroundColor.value = option.backgroundColor;
        } else {
          backgroundColor.value = '#fff';
        }

        log(t('editor.chartOK') + updateTime.toFixed(2) + 'ms');

        const debounceTimeQuantities = [0, 500, 2000, 5000, 10000];
        for (let i = debounceTimeQuantities.length - 1; i >= 0; i--) {
          const quantity = debounceTimeQuantities[i];
          const preferredDebounceTime =
            debounceTimeQuantities[i + 1] || 1000000;
          if (
            updateTime >= quantity &&
            debouncedTime.value !== preferredDebounceTime
          ) {
            debouncedRun.value = debounce(run, preferredDebounceTime, {
              trailing: true
            });
            debouncedTime.value = preferredDebounceTime;
            break;
          }
        }

        if (isFirstRun) {
          emit('ready');
          isFirstRun = false;
        }
      },
      (cssVal) => {
        css.value = cssVal;
      }
    );
  } else {
    runCode();
  }
}

onMounted(() => {
  // debouncedRun will be created at first run
  run();
  // TODO CSP 问题
  // fetchVersionList();
});

const hasRandomData = computed(() => {
  return shared.runCode && shared.runCode.indexOf('Math.random()') >= 0;
});

const editLink = computed(() => {
  const url = getSharableURL(true);
  return './editor.html' + url.search;
});

const versionList = computed(() => {
  return nightly.value ? nightlyVersions.value : allEChartsVersions.value;
});

const isNightlyVersion = computed(() => {
  return shared.echartsVersion && shared.echartsVersion.indexOf('dev') > -1;
});

const toolOptions = computed(() => {
  const isCanvas = shared.renderer === 'canvas';
  return {
    renderer: isCanvas ? null : shared.renderer,
    useDirtyRect: shared.useDirtyRect && isCanvas ? 1 : null,
    decal: shared.enableDecal ? 1 : null,
    theme: shared.darkMode ? 'dark' : shared.theme || null
  };
});

watch(
  () => shared.runCode,
  () => {
    if (autoRun.value || !sandbox.value) {
      if (!debouncedRun.value) {
        // First run
        run();
        // show share hint on first run if code is user-shared
        shared.isSharedCode && showShareHint();
        // show PR hint on first run if it's based on PR
        shared.isPR &&
          !prHintTimer.value &&
          (prHintTimer.value = setTimeout(
            showPRHint,
            shared.isSharedCode ? 1e3 : 0
          ));
      } else {
        debouncedRun.value();
      }
    }
  }
);

watch(
  toolOptions,
  () => {
    refresh();
  },
  { deep: true }
);

watch(
  isNightlyVersion,
  (val) => {
    nightly.value = val;
  },
  { immediate: true }
);

function refresh() {
  run(true);
}

function refreshAll() {
  // trigger reload
  scripts.value = null;
  run(true);
}

function dispose() {
  if (sandbox.value) {
    sandbox.value.dispose();
    sandbox.value = null;
  }
}

function downloadExample() {
  const url = getSharableURL(true);
  const isShared = shared.isSharedCode || url.searchParams.has('code');
  const headers = [`\t${t('editor.downloadSourceTip')} ${url.toString()}`];
  isShared && headers.push('\t⚠ ' + t('editor.share.hint'));
  download(headers.join('\n'));
}

function screenshot() {
  sandbox.value &&
    sandbox.value.screenshot(
      (URL_PARAMS.c || Date.now()) +
        '.' +
        (shared.renderer === 'svg' ? 'svg' : 'png')
    );
}

function showPRHint() {
  ElMessage({
    type: 'warning',
    message: t('editor.pr.hint').replace('{{PR}}', shared.prNumber),
    customClass: 'toast-declaration',
    duration: 8000,
    showClose: true
  });
}

function showShareHint() {
  ElMessage.closeAll();
  ElMessage({
    type: 'warning',
    message: t('editor.share.hint'),
    customClass: 'toast-declaration',
    duration: 8000,
    showClose: true
  });
}

function getSharableURL(raw) {
  const params = {};
  if (shared.initialCode !== shared.sourceCode) {
    params.code = compressStr(shared.sourceCode);
    params.enc = null;
  }
  return getURL(
    {
      ...toolOptions.value,
      ...params
    },
    raw
  );
}

function share() {
  if (isShareBusy.value) {
    return;
  }
  isShareBusy.value = true;
  const sharableURL = getSharableURL();
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
        isShareBusy.value = false;
        ElMessage.closeAll();
        ElMessage({
          type: 'error',
          message: t('editor.share.urlTooLong'),
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
        ElMessage.closeAll();
        ElMessage({
          type: 'success',
          message: t('editor.share.success'),
          customClass: 'toast-declaration'
        });
      })
      // PENDING
      .catch((e) => {
        console.error('failed to write share url to the clipboard', e);
        window.open(url, '_blank');
      })
      .finally(() => {
        isShareBusy.value = false;
      });
  }
}

function getOption() {
  return sandbox.value && sandbox.value.getOption();
}

function changeVersion() {
  saveExampleCodeToLocal();
  setTimeout(() => {
    // no confirmation as we have saved the code to local storage
    window.__EDITOR_NO_LEAVE_CONFIRMATION__ = true;
    gotoURL({
      version: shared.echartsVersion,
      pv: shared.isPR ? URL_PARAMS.version : void 0,
      ...toolOptions.value
    });
  });
}

function changeRandomSeed() {
  updateRandomSeed();
  gotoURL({ random: shared.randomSeed }, true);
  run();
}

function fetchVersionList() {
  const isZH = shared.locale === 'zh';
  const getVersionListAPI = (pkgName) =>
    isZH
      ? // speed up for China mainland. `data.jsdelivr.com` is very slow or unaccessible for some ISPs.
        // Another API is `https://registry.npmmirror.com/${pkgName}` with a request header `Accept: application/vnd.npm.install-v1+json`.
        `https://registry.npmmirror.com/-/v1/search?text=${pkgName}&size=1`
      : `https://data.jsdelivr.com/v1/package/npm/${pkgName}`;

  const handleData =
    isZH &&
    ((rawData) => {
      rawData = rawData.objects[0].package;
      const versions = rawData.versions.sort(rcompare);
      const tags = rawData['dist-tags'];
      return {
        versions,
        tags
      };
    });

  const prVersion = URL_PARAMS.pv;
  hasPRVersion.value = isValidPRVersion(prVersion);

  $.getJSON(getVersionListAPI('echarts')).done((data) => {
    isZH && (data = handleData(data));

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
    allEChartsVersions.value = versions;

    // Use latest version
    if (
      !shared.echartsVersion ||
      shared.echartsVersion === '5' ||
      shared.echartsVersion === 'latest'
    ) {
      shared.echartsVersion = versions[0];
    }

    // put latest rc version for preview
    if (gt(data.tags.rc.split('-')[0], data.tags.latest)) {
      versions.unshift(data.tags.rc);
      shared.echartsVersion === 'rc' && (shared.echartsVersion = versions[0]);
    }

    hasPRVersion.value && versions.unshift(prVersion);
  });

  // TODO lazy load when needed
  $.getJSON(getVersionListAPI('echarts-nightly')).done((data) => {
    isZH && (data = handleData(data));

    if (isDebug) {
      console.log('echarts-nightly version data', data);
    }

    const {
      tags: { latest, next },
      versions
    } = data;
    const nextIdx = versions.indexOf(next);
    const latestIdx = versions.indexOf(latest);
    nightlyVersions.value = versions
      .slice(nextIdx, Math.min(nextIdx + 10, latestIdx))
      .concat(versions.slice(latestIdx, latestIdx + 10));

    hasPRVersion.value && nightlyVersions.value.unshift(prVersion);
  });

  if (isDebug) {
    console.log(
      'echarts versions',
      allEChartsVersions.value,
      'nightly versions',
      nightlyVersions.value
    );
  }
}

function getAssets() {
  return {
    scripts: scripts.value,
    css: css.value
  };
}

defineExpose({
  getAssets,
  getOption,
  refreshAll
});
</script>

<style lang="scss">
@import '../style/color.scss';

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#chart-panel {
  flex-grow: 1;
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
  @include flex-center;
  flex-shrink: 0;
  flex-wrap: wrap;

  user-select: none;

  * {
    font-size: 12px;
  }

  .left-panel {
    @include flex-center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-start;

    > * {
      margin-left: 0 !important;
    }
  }

  .render-config-trigger {
    cursor: pointer;
    font-weight: 500;
  }

  .version-select {
    width: 80px;

    &.is-nightly,
    &.is-pr {
      width: 160px;
    }
  }

  label {
    margin-bottom: 0;
  }

  .edit {
    cursor: pointer;
  }
}

.full {
  position: absolute;
  inset: 5px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  #chart-panel {
    box-shadow: rgba(10, 9, 9, 0.1) 0px 0px 5px;
  }
}

#preview-status {
  flex-shrink: 0;
  font-size: 0.9rem;
  @include flex-center;
  flex-wrap: wrap;
  gap: 10px;
  white-space: nowrap;

  .left-buttons {
    @include flex-center;
    flex-wrap: wrap;
    flex-shrink: 0;
    gap: 10px;

    > * {
      margin-left: 0 !important;
    }
  }

  #run-log {
    @include flex-center;
    font-size: 12px;
    text-align: right;
    gap: 10px;

    .run-log-time {
      color: $clr-text;
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

.el-switch {
  height: 20px;
}

.el-popover {
  width: auto !important;
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
