<template>
  <div id="main-container">
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
              <div class="editor-controls">
                <a class="btn btn-sm format" @click="format">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <span>{{ $t('editor.format') }}</span>
                </a>
                <a class="btn btn-default btn-sm run" @click="disposeAndRun">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ $t('editor.run') }}</span>
                </a>
              </div>
            </el-header>
            <el-main>
              <CodeMonaco
                v-if="shared.typeCheck"
                id="code-panel"
                :initialCode="initialCode"
              ></CodeMonaco>
              <CodeAce
                v-else
                id="code-panel"
                :initialCode="initialCode"
              ></CodeAce>
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
          <div id="option-outline"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="handler"
      id="h-handler"
      @mousedown="onSplitterDragStart"
      :style="{ left: leftContainerSize + '%' }"
      v-if="!shared.isMobile"
    ></div>
    <Preview
      :inEditor="true"
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
  getExampleConfig
} from '../common/store';
import { collectDeps, buildExampleCode } from '../../common/buildCode';
import { gotoURL } from '../common/route';
import { mount } from '@lang/object-visualizer';

import './object-visualizer.css';
import { URL_PARAMS } from '../common/config';
import { formatCode } from '../common/helper';

export default {
  components: {
    CodeAce,
    CodeMonaco,
    FullCodePreview,
    Preview
  },

  data() {
    return {
      mousedown: false,
      leftContainerSize: 40,
      mobileMode: false,
      shared: store,
      initialCode: '',

      currentTab: 'code-editor',

      fullCode: '',

      exampleConfig: getExampleConfig(),

      fullCodeConfig: {
        mimimal: false,
        esm: true,
        node: false // If is in node
      }
    };
  },

  computed: {
    hasTs() {
      return this.exampleConfig && this.exampleConfig.ts;
    },
    currentTime() {
      // Update time when message updated.
      const message = this.shared.message;

      const time = new Date();
      const digits = [time.getHours(), time.getMinutes(), time.getSeconds()];
      let timeStr = '';
      for (let i = 0, len = digits.length; i < len; ++i) {
        timeStr += (digits[i] < 10 ? '0' : '') + digits[i];
        if (i < len - 1) {
          timeStr += ':';
        }
      }
      return timeStr;
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
      });

      window.addEventListener('mousemove', (e) => {
        if (this.mousedown) {
          let percentage = e.clientX / window.innerWidth;
          percentage = Math.min(0.9, Math.max(0.1, percentage));
          this.leftContainerSize = percentage * 100;
        }
      });

      window.addEventListener('mouseup', (e) => {
        this.mousedown = false;
      });
    }
  },

  methods: {
    onSplitterDragStart() {
      this.mousedown = true;
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
        theme: store.darkMode ? 'dark' : '',
        ROOT_PATH: store.cdnRoot
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
      mount(option, this.$el.querySelector('#option-outline'), {
        getKeys(object, path) {
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
          const link = `https://echarts.apache.org/${lang}/option.html#${hash.join(
            '.'
          )}`;
          return !isObjOrArray
            ? `<a href="${link}" target="_blank" title="${tipTitle}">${name}</a>`
            : `${name}<a href="${link}" target="_blank" title="${tipTitle}"><i class="el-icon-document"></i></a>`;
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
      }
    },
    changeLang(lang) {
      if ((URL_PARAMS.lang || 'js').toLowerCase() !== lang) {
        if (!this.initialCode || store.sourceCode === this.initialCode) {
          gotoURL(
            Object.assign({}, URL_PARAMS, {
              lang
            })
          );
        } else {
          this.$confirm(this.$t('editor.codeChangedConfirm'), '', {
            confirmButtonText: this.$t('editor.confirmButtonText'),
            cancelButtonText: this.$t('editor.cancelButtonText'),
            type: 'warning'
          })
            .then(() => {
              gotoURL(
                Object.assign({}, URL_PARAMS, {
                  lang
                })
              );
            })
            .catch(() => {});
        }
      }
    },
    format() {
      formatCode(store.sourceCode).then((code) => {
        this.initialCode = code;
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
$handler-width: 5px;

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

  .el-tabs__item {
    height: 34px;
    line-height: 34px;
  }
}

#editor-control-panel,
#full-code-generate-config {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

  .el-icon-document {
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

  .editor-controls {
    float: right;

    .el-switch__label {
      margin-top: -3px;
    }
    .el-switch__label * {
      font-size: 12px;
    }

    .btn {
      border-radius: 0;
      margin-left: $pd-basic;
      border: none;
      height: 30px;

      background: none;
      color: $clr-text;

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
    }
  }
}

.right-container {
  position: absolute;
  right: 0;

  width: 50%;
  height: 100%;
  padding: 0;
  padding-left: $handler-width;
  border: none;
  z-index: 30;

  background: $clr-bg;
}
</style>
