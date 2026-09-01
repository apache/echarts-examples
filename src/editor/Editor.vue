<template>
  <div id="main-container" :class="{ 'is-dragging': draggingMouseDown }">
    <div
      id="editor-left-container"
      :style="{ width: leftContainerSize + '%' }"
      v-if="!shared.isMobile"
    >
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane name="code-editor">
          <span slot="label">{{ $t('editor.tabEditor') }}</span>
          <el-container>
            <el-header id="editor-control-panel">
              <div>
                <div class="languages">
                  <el-tooltip
                    :content="$t('editor.tooltip.jsMode')"
                    placement="bottom"
                  >
                    <a
                      :class="{ js: true, active: !shared.typeCheck }"
                      @click="changeLang('js')"
                      >JS</a
                    >
                  </el-tooltip>
                  <el-tooltip
                    :content="$t(`editor.tooltip.${hasTs ? 'tsMode' : 'noTs'}`)"
                    placement="bottom"
                  >
                    <a
                      @click="hasTs && changeLang('ts')"
                      :class="{
                        ts: true,
                        active: shared.typeCheck,
                        disabled: !hasTs
                      }"
                      >TS</a
                    >
                  </el-tooltip>
                </div>
                <div class="example-version-since" v-if="hasVersionSince">
                  {{ versionSinceBanner }}
                </div>
              </div>
              <div class="editor-controls">
                <a
                  v-if="shared.isPR"
                  class="btn btn-default btn-sm pull-request"
                  target="_blank"
                  :href="`https://github.com/apache/echarts/pull/${shared.prNumber}`"
                  :title="`${pr && pr.title ? pr.title + '\n' : ''}${$t(
                    'editor.pr.tooltip'
                  )}`"
                >
                  <SVGIcon name="github" />
                  <span>#{{ shared.prNumber }}</span>
                </a>
                <a
                  class="btn btn-sm codepen"
                  @click="toExternalEditor('CodePen')"
                  :title="$t('editor.openWithCodePen')"
                >
                  <SVGIcon name="codepen" />
                </a>
                <a
                  class="btn btn-sm codesandbox"
                  @click="toExternalEditor('CodeSandbox')"
                  :title="$t('editor.openWithCodeSandbox')"
                >
                  <SVGIcon name="codesandbox" class="fill-none" />
                </a>
                <a
                  class="btn btn-sm format"
                  :title="$t('editor.format')"
                  :disabled="!formatterReady"
                  :style="{ cursor: formatterReady ? '' : 'progress' }"
                  @click="format"
                >
                  <SVGIcon name="format" class="stroke-current fill-none" />
                </a>
                <a class="btn btn-default btn-sm run" @click="disposeAndRun">
                  <SVGIcon name="play" class="stroke-current fill-none" />
                  <span>{{ $t('editor.run') }}</span>
                </a>
              </div>
            </el-header>
            <el-main>
              <CodeMonaco
                v-if="shared.typeCheck"
                id="code-panel"
                :initialCode="initialCode"
                @ready="prepareFormatter"
              />
              <CodeAce v-else id="code-panel" :initialCode="initialCode" />
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane
          :label="$t('editor.tabFullCodePreview')"
          name="full-code"
          :lazy="true"
        >
          <el-container style="width: 100%; height: 100%">
            <el-header id="full-code-generate-config">
              <span class="full-code-generate-config-label">
                <!-- <i class="el-icon-setting"></i> 配置 -->
              </span>
              <el-switch
                v-model="fullCodeConfig.minimal"
                :active-text="$t('editor.minimalBundle')"
                :inactive-text="''"
              >
              </el-switch>
              <el-switch
                v-if="!shared.typeCheck"
                v-model="fullCodeConfig.esm"
                active-text="ES Modules"
                :inactive-text="''"
              >
              </el-switch>
            </el-header>
            <el-main>
              <FullCodePreview :code="fullCode"></FullCodePreview>
            </el-main>
          </el-container>
        </el-tab-pane>

        <el-tab-pane :label="$t('editor.tabOptionPreview')" name="full-option">
          <div id="option-outline" ref="optionOutline"></div>
        </el-tab-pane>

        <el-tab-pane
          v-if="shared.isPR"
          v-loading="isPRLoading"
          :label="$t('editor.prPreview.title')"
          name="pr-preview"
        >
          <div v-if="pr" id="pr-preview" ref="prPreview">
            <el-descriptions
              class="pr-info"
              direction="vertical"
              size="small"
              :column="4"
              border
            >
              <a
                slot="title"
                class="pr-title"
                ref="prTitle"
                target="_blank"
                :href="pr.html_url"
                >(#{{ pr.number }}) {{ pr.title }}</a
              >
              <el-descriptions-item :label="$t('editor.prPreview.author')">
                <a
                  target="_blank"
                  :href="pr.user.html_url"
                  class="pr-author-avatar"
                >
                  <el-avatar :src="pr.user.avatar_url" :size="20" />
                  <span>{{ pr.user.login }}</span>
                </a>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('editor.prPreview.fromBranch')">
                <a
                  target="_blank"
                  :href="pr.head.repo.html_url + '/tree/' + pr.head.ref"
                  :title="pr.head.label"
                >
                  {{ pr.head.ref }}
                </a>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('editor.prPreview.toBranch')">
                <a
                  target="_blank"
                  :href="pr.base.repo.html_url + '/tree/' + pr.base.ref"
                  :title="pr.base.label"
                >
                  {{ pr.base.ref }}
                </a>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('editor.prPreview.milestone')">
                <a
                  v-if="pr.milestone"
                  target="_blank"
                  :href="pr.milestone.html_url"
                >
                  {{ pr.milestone.title }}
                </a>
                <template v-else>-</template>
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('editor.prPreview.labels')"
                :span="4"
              >
                <el-tag
                  v-for="label in pr.labels"
                  :key="label.id"
                  size="small"
                  class="pr-label"
                  :color="'#' + label.color"
                  :title="label.description"
                  >{{ label.name }}</el-tag
                >
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('editor.prPreview.changes')"
                :span="4"
              >
                <el-descriptions
                  size="small"
                  direction="vertical"
                  :column="5"
                  :colon="false"
                >
                  <el-descriptions-item
                    :label="$t('editor.prPreview.addedLines')"
                  >
                    <span>
                      {{ pr.additions }}
                    </span>
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="$t('editor.prPreview.removedLines')"
                  >
                    <span>
                      {{ pr.deletions }}
                    </span>
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="$t('editor.prPreview.changedFiles')"
                  >
                    <a :href="pr.html_url + '/files'" target="_blank">
                      {{ pr.changed_files }}
                    </a>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('editor.prPreview.commits')">
                    <a :href="pr.html_url + '/commits'" target="_blank">
                      {{ pr.commits }}
                    </a>
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="$t('editor.prPreview.latestCommit')"
                  >
                    <a
                      :href="pr.html_url + '/commits/' + pr.head.sha"
                      target="_blank"
                    >
                      {{ pr.head.sha.slice(0, 7) }}
                    </a>
                  </el-descriptions-item>
                </el-descriptions>
              </el-descriptions-item>
              <el-descriptions-item :span="4">
                <span slot="label">
                  {{ $t('editor.prPreview.review') }}
                  <svg
                    role="img"
                    v-if="isPRReviewLoading"
                    class="icon"
                    style="margin-left: 5px"
                  >
                    <use href="/asset/sprite.svg#loading"></use>
                  </svg>
                </span>
                <span v-if="isPRReviewLoading">{{
                  $t('editor.prPreview.loadingReview')
                }}</span>
                <span v-else-if="isPRReviewLoading === false">{{
                  $t('editor.prPreview.reviewLoadFailed')
                }}</span>
                <span v-else-if="!prLatestReview">{{
                  $t('editor.prPreview.noReview')
                }}</span>
                <el-descriptions
                  v-else
                  size="small"
                  direction="vertical"
                  :column="3"
                  :colon="false"
                >
                  <el-descriptions-item
                    :label="$t('editor.prPreview.reviewedBy')"
                  >
                    <a
                      target="_blank"
                      :href="prLatestReview.user.html_url"
                      class="pr-author-avatar"
                    >
                      <el-avatar
                        :src="prLatestReview.user.avatar_url"
                        :size="20"
                      />
                      <span>{{ prLatestReview.user.login }}</span>
                    </a>
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="$t('editor.prPreview.reviewedAt')"
                  >
                    {{ new Date(prLatestReview.submitted_at).toLocaleString() }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="$t('editor.prPreview.reviewState')"
                  >
                    {{ prLatestReview.state }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="$t('editor.prPreview.reviewComment')"
                    :span="3"
                  >
                    <a :href="prLatestReview.html_url" target="_blank">
                      {{
                        prLatestReview.body || $t('editor.prPreview.noComment')
                      }}
                    </a>
                  </el-descriptions-item>
                </el-descriptions>
              </el-descriptions-item>
              <el-descriptions-item
                :label="$t('editor.prPreview.diff')"
                :span="4"
              >
                <details @toggle="$event.target.open && loadPRDiff()">
                  <summary style="display: revert; cursor: pointer">
                    {{ $t('editor.prPreview.viewDiff') }}
                    <svg
                      role="img"
                      v-if="isPRDiffLoading"
                      class="icon"
                      style="margin-left: 5px"
                    >
                      <use href="/asset/sprite.svg#loading"></use>
                    </svg>
                  </summary>
                  <pre
                    class="pr-diff"
                  ><span v-if="isPRDiffLoading">{{ $t('editor.prPreview.loadingDiff') }}</span><span v-if="isPRDiffLoading === false">{{ $t('editor.prPreview.diffLoadFailed') }}</span><div ref="prDiff"></div></pre>
                </details>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="handler"
      id="h-handler"
      @mousedown="draggingMouseDown = true"
      :style="{ left: leftContainerSize + '%' }"
      v-if="!shared.isMobile"
    ></div>
    <Preview
      :inEditor="true"
      @ready="onPreviewReady"
      class="right-container"
      ref="preview"
      :style="{
        width: 100 - leftContainerSize + '%',
        left: leftContainerSize + '%'
      }"
    ></Preview>
  </div>
</template>

<script>
import CodeAce from './CodeAce.vue';
import CodeMonaco from './CodeMonaco.vue';
import FullCodePreview from './FullCodePreview.vue';
import Preview from './Preview.vue';
import {
  store,
  loadExampleCode,
  parseSourceCode,
  getExampleConfig,
  CODE_CHANGED_FLAG
} from '../common/store';
import { collectDeps, buildExampleCode } from '../../common/buildCode';
import { gotoURL } from '../common/route';
import { mount } from '@lang/object-visualizer';
import { compareVersions } from 'compare-versions';

import './object-visualizer.css';
import { getScriptURLs, URL_PARAMS } from '../common/config';
import { formatCode, loadScriptsAsync } from '../common/helper';
import openWithCodePen from './sandbox/openwith/codepen';
import openWithCodeSandbox from './sandbox/openwith/codesandbox';
import SVGIcon from '../common/SVGIcon.vue';

export default {
  components: {
    CodeAce,
    CodeMonaco,
    FullCodePreview,
    Preview,
    SVGIcon
  },

  data() {
    return {
      leftContainerSize: 40,
      shared: store,
      initialCode: '',

      currentTab: 'code-editor',

      fullCode: '',

      exampleConfig: getExampleConfig(),

      fullCodeConfig: {
        minimal: false,
        esm: true,
        node: false // If is in node
      },

      formatterReady: false,

      pr: null,
      isPRLoading: false,
      prLatestReview: null,
      isPRReviewLoading: false,
      isPRDiffLoading: false,

      draggingMouseDown: false
    };
  },

  computed: {
    hasTs() {
      return this.exampleConfig && this.exampleConfig.ts;
    },

    hasVersionSince() {
      return (
        this.exampleConfig &&
        this.exampleConfig.since &&
        compareVersions(
          this.shared.echartsFullVersion,
          this.exampleConfig.since
        ) >= 0
      );
    },

    versionSinceBanner() {
      return (
        this.$t('editor.bannerVersionRequire') +
        ' v' +
        this.exampleConfig.since +
        '+'
      );
    }
  },

  mounted() {
    if (store.isMobile) {
      this.leftContainerSize = 0;
      loadExampleCode().then((code) => {
        // No editor available. Set to runCode directly.
        store.runCode = parseSourceCode(code);
      });
    } else {
      loadExampleCode().then((code) => {
        // Only set the code in editor. editor will sync to the store.
        this.initialCode = parseSourceCode(code);
        if (store.initialCode !== CODE_CHANGED_FLAG) {
          store.initialCode = this.initialCode;
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (this.draggingMouseDown) {
          let percentage = e.clientX / window.innerWidth;
          percentage = Math.min(0.9, Math.max(0.1, percentage));
          this.leftContainerSize = percentage * 100;
        }
      });

      window.addEventListener('mouseup', () => {
        this.draggingMouseDown = false;
      });

      // Save code as a sharable link when ctrl/cmd + s is pressed.
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          const previewRef = this.$refs.preview;
          previewRef && previewRef.share();
          e.preventDefault();
        }
      });

      window.addEventListener('beforeunload', (e) => {
        // no repeated prompt if already confirmed or the code is not changed
        if (
          window.__EDITOR_NO_LEAVE_CONFIRMATION__ ||
          store.sourceCode === this.initialCode
        ) {
          return;
        }
        // prevent the code from being lost accidentally due to refreshing or closing the page
        e.preventDefault();
        e.returnValue = '';
      });

      // ensure prettier
      store.typeCheck || this.prepareFormatter();
    }
  },

  methods: {
    toExternalEditor(vendor) {
      const previewRef = this.$refs.preview;
      if (!previewRef) {
        return;
      }
      const assets = previewRef.getAssets();
      const vendors = {
        CodePen: openWithCodePen,
        CodeSandbox: openWithCodeSandbox
      };
      vendors[vendor](
        this.exampleConfig && this.exampleConfig.title,
        assets.scripts,
        assets.css
      );
    },
    disposeAndRun() {
      this.$refs.preview.refreshAll();
    },
    updateFullCode() {
      const option = this.$refs.preview.getOption();
      if (!option) {
        return;
      }
      const deps = collectDeps(option);
      deps.push(store.renderer === 'svg' ? 'SVGRenderer' : 'CanvasRenderer');
      this.fullCode = buildExampleCode(store.sourceCode, deps, {
        minimal: this.fullCodeConfig.minimal,
        ts: store.typeCheck,
        esm: this.fullCodeConfig.esm,
        // legacy: true,
        theme: store.darkMode ? 'dark' : store.theme,
        renderer: store.renderer,
        useDirtyRect: store.useDirtyRect,
        ROOT_PATH: store.cdnRoot,
        CDN_PATH: store.cdnPath,
        isZHLang: this.$i18n.locale === 'zh'
      });
      // Format
      formatCode(this.fullCode).then((code) => {
        this.fullCode = code;
      });
    },
    updateOptionOutline() {
      const option = Object.freeze(this.$refs.preview.getOption());
      if (!option) {
        return;
      }
      const tipTitle = this.$t('editor.tooltip.gotoDoc');
      const lang = this.$i18n.locale;
      mount(option, this.$refs.optionOutline, {
        getKeys(object) {
          return Object.keys(object).filter((key) => {
            if (Array.isArray(object[key]) && !object[key].length) {
              return false;
            }
            return true;
          });
        },
        renderName(name, path) {
          let obj = option;
          let hash = [];
          let isTopLevel = true;
          for (let i = 0; i < path.length; i++) {
            let key = path[i];
            obj = obj[key];

            if (obj == null) {
              hash.push(key);
              break;
            }

            if (Array.isArray(obj) && isTopLevel) {
              // Get type of component / series.
              const item = obj[path[i + 1]];
              const type = item && item.type;
              if (type) {
                key += '-' + type;
                i++;
                obj = item;
              }
            } else if (!isNaN(key)) {
              // Ignore data[0]
              continue;
            }
            hash.push(key);
          }

          const isObjOrArray = typeof obj === 'object' && obj != null;
          const link = hash.includes('bmap')
            ? 'https://github.com/apache/echarts/blob/release/extension-src/bmap/README.md'
            : `https://echarts.apache.org/${lang}/option.html#${hash.join(
                '.'
              )}`;
          return !isObjOrArray
            ? `<a href="${link}" target="_blank" title="${tipTitle}">${name}</a>`
            : `${name}<a href="${link}" target="_blank" title="${tipTitle}"><svg role="img" class="icon icon-document"><use href="/asset/sprite.svg#document"></use></svg></a>`;
        },
        expandOnCreatedAndUpdated(path) {
          return (
            path.length === 0 || (path[0] === 'series' && path.length <= 1)
          );
        }
      });
    },
    updateTabContent(tab) {
      if (tab === 'full-code') {
        this.updateFullCode();
      } else if (tab === 'full-option') {
        this.updateOptionOutline();
      } else if (tab === 'pr-preview') {
        this.preparePRPreview();
      }
    },
    changeLang(lang) {
      if ((URL_PARAMS.lang || 'js').toLowerCase() !== lang) {
        if (!this.initialCode || store.sourceCode === this.initialCode) {
          gotoURL({ lang });
        } else {
          this.$confirm(this.$t('editor.codeChangedConfirm'), '', {
            confirmButtonText: this.$t('editor.confirmButtonText'),
            cancelButtonText: this.$t('editor.cancelButtonText'),
            type: 'warning'
          })
            .then(() => {
              // already confirmed
              window.__EDITOR_NO_LEAVE_CONFIRMATION__ = true;
              gotoURL({ lang });
            })
            .catch(() => {});
        }
      }
    },
    format() {
      if (!this.formatterReady) {
        console.warn('formatter is not ready yet!');
        return;
      }
      formatCode(store.sourceCode).then((code) => {
        if (
          code === this.initialCode &&
          store.sourceCode !== this.initialCode
        ) {
          // If formatted code is the same as initial code but source code is changed,
          // should also trigger update
          this.initialCode = store.sourceCode;
        }
        this.$nextTick(() => {
          this.initialCode = code;
        });
      });
    },
    prepareFormatter() {
      return formatCode(' ').then(() => {
        this.formatterReady = true;
      });
    },
    onPreviewReady() {
      this.updateTabContent(this.currentTab);
    },
    preparePRPreview() {
      if (!store.isPR || this.isPRLoading || this.pr) {
        return;
      }
      this.isPRLoading = true;
      const prURL = `https://api.github.com/repos/apache/echarts/pulls/${store.prNumber}`;
      $.ajax({
        url: prURL,
        headers: {
          Accept: 'application/json'
        },
        dataType: 'json',
        success: (pr) => {
          this.pr = pr;
          this.isPRReviewLoading = true;
          $.ajax({
            url: prURL + '/reviews?per_page=100',
            headers: {
              Accept: 'application/json'
            },
            dataType: 'json',
            success: (reviews) => {
              const prLatestReview = (this.prLatestReview =
                reviews[reviews.length - 1]);
              if (
                prLatestReview &&
                prLatestReview.state === 'COMMENTED' &&
                !prLatestReview.body
              ) {
                $.ajax({
                  url:
                    prURL +
                    '/reviews/' +
                    prLatestReview.id +
                    '/comments?direction=desc&sort=created&per_page=100',
                  headers: {
                    Accept: 'application/json'
                  },
                  dataType: 'json',
                  success: (comments) => {
                    const comment = comments[0];
                    prLatestReview.body = comment.body;
                    prLatestReview.submitted_at = comment.created_at;
                    prLatestReview.html_url = comment.html_url;
                  },
                  error: (xhr, status, err) => {
                    console.error('failed to fetch PR review comment', err);
                  },
                  complete: () => {
                    this.isPRReviewLoading = 0;
                  }
                });
              } else {
                this.isPRReviewLoading = 0;
              }
            },
            error: (xhr, status, err) => {
              this.isPRReviewLoading = false;
              console.error('failed to fetch PR reviews', err);
            }
          });
        },
        error(xhr, status, err) {
          console.error('failed to fetch PR info', err);
        },
        complete: () => {
          this.isPRLoading = false;
        }
      });
    },
    loadPRDiff() {
      if (this.isPRDiffLoading || this.isPRDiffLoading === 0) {
        return;
      }
      this.isPRDiffLoading = true;
      $.ajax({
        url: `https://api.github.com/repos/apache/echarts/pulls/${store.prNumber}`,
        headers: {
          Accept: 'application/vnd.github.v3.diff'
        },
        dataType: 'text',
        success: (diff) => {
          const SCRIPT_URLS = getScriptURLs(store.locale);
          const highlightjsDir = SCRIPT_URLS.highlightjsDir;
          loadScriptsAsync([
            highlightjsDir + '/styles/github.min.css',
            highlightjsDir + '/highlight.min.js',
            highlightjsDir + '/languages/diff.min.js'
          ])
            .then(() => {
              return hljs.highlight(diff, {
                language: 'diff'
              }).value;
            })
            .catch((err) => {
              console.error('failed to load PR diff', err);
            })
            .then((diff) => {
              this.isPRDiffLoading = diff ? 0 : false;
              diff && (this.$refs.prDiff.innerHTML = diff);
            });
        },
        error: (xhr, status, err) => {
          this.isPRDiffLoading = false;
          console.error('failed to fetch PR diff', err);
        }
      });
    }
  },

  watch: {
    currentTab(tab) {
      this.updateTabContent(tab);
    },
    'shared.runHash'() {
      this.updateTabContent(this.currentTab);
    },
    fullCodeConfig: {
      deep: true,
      handler() {
        this.updateFullCode();
      }
    }
  }
};
</script>

<style lang="scss">
@import '../style/color.scss';

$control-panel-height: 30px;
$pd-basic: 10px;
$handler-width: 15px;

#main-container {
  .handler {
    position: absolute;
    left: 50%;

    top: 0;
    bottom: 0;
    width: $handler-width;

    cursor: col-resize;
    z-index: 100;
    background-color: transparent;
    border-left: 1px solid #ececec;
    // border-right: 1px solid $clr-border;
  }

  &.is-dragging {
    user-select: none;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: col-resize;
      z-index: 9999;
    }
  }
}

#editor-left-container {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;

  width: 50%;

  .el-tab-pane {
    height: 100%;

    .el-container {
      width: 100%;
      height: 100%;
    }

    .el-header {
      height: $control-panel-height !important;
      position: relative;
      z-index: 10;
      padding: 0;
    }
    .el-main {
      padding: 0;
      position: relative;

      ::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        transition: all 0.3s ease-in-out;
        border-radius: 2px;
      }

      ::-webkit-scrollbar-button {
        display: none;
      }

      ::-webkit-scrollbar-thumb {
        width: 8px;
        min-height: 15px;
        background: rgba(50, 50, 50, 0.6) !important;
        transition: all 0.3s ease-in-out;
        border-radius: 2px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.5) !important;
      }
    }
  }

  .el-tabs {
    box-shadow: none;
  }

  .el-tabs--border-card > .el-tabs__header {
    border-bottom: none;
  }

  .el-tabs__content {
    position: absolute;
    top: 34px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
  }

  .el-tabs__item,
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    height: 34px;
    line-height: 34px;
  }
}

#editor-control-panel,
#full-code-generate-config {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  user-select: none;
}

#option-outline {
  // height: 100%;
  // Fix safari
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  font-size: 13px;

  font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas',
    monospace;

  .icon-document {
    margin-left: 5px;
    font-size: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

#full-code-generate-config {
  .full-code-generate-config-label {
    height: $control-panel-height;
    line-height: $control-panel-height;
    vertical-align: middle;
    margin: 0 0 0 20px;
  }

  .el-switch {
    margin-right: 10px;
  }

  .el-switch__label {
    margin-left: 8px;
    margin-top: -2px;
  }
  .el-switch__label * {
    font-size: 12px;
  }
}

#editor-control-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;

  .setting-panel {
    display: inline-block;

    .btn-group + .btn-group {
      margin-left: $pd-basic;
    }
  }

  .languages {
    display: inline-block;
    padding: 2px 10px;
    font-weight: bold;

    a {
      display: inline-block;
      padding: 3px 10px;
      margin-left: 5px;
      vertical-align: middle;
      cursor: pointer;

      &.ts {
        color: #3178c6;
      }

      &.ts.disabled {
        color: #ddd;
        cursor: default;

        &:hover {
          text-decoration: none;
        }
      }

      &.js {
        color: #000;
      }

      &.active {
        font-size: 12px;
        border-radius: 3px;

        &.js {
          background: #f7df1e;
          color: #000;
        }

        &.ts {
          background: #3178c6;
          color: #fff;
        }
      }
    }
  }

  .example-version-since {
    display: inline-block;
    padding: 1px 5px;
    vertical-align: middle;
    font-size: 10px;
    // background: #fb628b;
    background: #409eff;
    color: #fff;
    font-weight: bold;
    border-radius: 2px;
  }

  .editor-controls {
    .el-switch__label {
      margin-top: -3px;
    }
    .el-switch__label * {
      font-size: 12px;
    }

    .btn {
      border-radius: 0;
      margin: 0;
      border: none;
      height: 30px;

      background: none;
      color: $clr-text;

      &:hover {
        color: #409eff;
      }

      & > * {
        display: inline-block;
        vertical-align: middle;
      }

      svg {
        width: 15px;
        height: 15px;
      }

      &.run {
        color: #fff;
        background-color: #409eff;
      }
      &.run:hover {
        background-color: lighten($color: #409eff, $amount: 5);
      }

      &.codepen {
        svg {
          transform: scale(1.08);
        }
      }
    }
  }
}

#pr-preview {
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;

  .pr-info {
    width: 100%;
  }

  .pr-author-avatar {
    display: flex;
    align-items: center;

    .el-avatar {
      margin-right: 6px;
    }
  }

  .pr-label {
    margin-right: 5px;
    margin-bottom: 5px;
    color: #fff;
    border: none;
    border-radius: 2em;
  }

  .pr-diff {
    width: 100%;
    margin-top: 5px;
    overflow: auto;
    box-sizing: border-box;
    white-space: pre-wrap;
  }
}

.right-container {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 50%;
  height: 100%;
  padding: 10px $handler-width;
  border: none;
  z-index: 30;

  background: $clr-bg;
}
.fill-none {
  fill: none;
}

.stroke-current {
  stroke: currentColor;
}
</style>
