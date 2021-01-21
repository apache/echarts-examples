<template>
<div id="main-container">
    <div id="editor-left-container" :style="{width: leftContainerSize + '%'}" v-if="!shared.isMobile">
        <el-tabs v-model="currentTab" type="border-card">
            <el-tab-pane :label="$t('editor.tabEditor')" name="code-editor">
                <el-container>
                    <el-header id="editor-control-panel">
                        <div id="code-info">
                            <template v-if="shared.editorStatus.message">
                                <span class="code-info-time">{{currentTime}}</span>
                                <span :class="'code-info-type-' + shared.editorStatus.type">{{shared.editorStatus.message}}</span>
                            </template>
                        </div>
                        <div class="editor-controls">
                            <!-- <el-switch v-model="shared.typeCheck"
                                :active-text="$t('editor.monacoMode')"
                                :inactive-text="''"
                            ></el-switch> -->
                            <a href="javascript:;" class='btn btn-default btn-sm' @click='disposeAndRun'>{{$t('editor.run')}}</a>
                        </div>
                    </el-header>
                    <el-main>
                        <CodeMonaco v-if="shared.typeCheck" id="code-panel" :initialCode="initialCode"></CodeMonaco>
                        <CodeAce v-else id="code-panel" :initialCode="initialCode"></CodeAce>
                    </el-main>
                </el-container>
            </el-tab-pane>

            <el-tab-pane :label="$t('editor.tabFullCodePreview')" name="full-code" :lazy="true">
                <el-container style="width: 100%; height: 100%">
                    <el-header id="full-code-generate-config">
                        <span class="full-code-generate-config-label">
                            <!-- <i class="el-icon-setting"></i> 配置 -->
                        </span>
                        <el-switch
                            class="enable-decal"
                            v-model="fullCodeConfig.minimal"
                            :active-text="$t('editor.minimalBundle')"
                            :inactive-text="''">
                        </el-switch>
                        <el-switch
                            class="enable-decal"
                            v-model="fullCodeConfig.esm"
                            active-text="ES Modules"
                            :inactive-text="''">
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
    <div class="handler" id="h-handler" @mousedown="onSplitterDragStart" :style="{left: leftContainerSize + '%'}" v-if="!shared.isMobile"></div>
    <Preview :inEditor="true" class="right-container" ref="preview" :style="{
        width: (100 - leftContainerSize) + '%',
        left: leftContainerSize + '%'
    }"></Preview>
</div>
</template>

<script>

import CodeAce from './CodeAce.vue';
import CodeMonaco from './CodeMonaco.vue';
import FullCodePreview from './FullCodePreview.vue';
import Preview from './Preview.vue';
import {URL_PARAMS} from '../common/config';
import {store, loadExampleCode, parseSourceCode} from '../common/store';
import {collectDeps, buildExampleCode} from '../../common/buildCode';
import { mount } from "@lang/object-visualizer";

import './object-visualizer.css';

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

            fullCodeConfig: {
                mimimal: false,
                esm: true,
                node: false // If is in node
            }
        };
    },

    computed: {
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
            loadExampleCode().then(code => {
                // No editor available. Set to runCode directly.
                store.runCode = parseSourceCode(code);
            });
        }
        else {
            loadExampleCode().then(code => {
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
                ts: false,
                esm: this.fullCodeConfig.esm,
                // legacy: true,
                theme: store.darkMode ? 'dark' : '',
                ROOT_PATH: store.cdnRoot
            });
        },
        updateOptionOutline() {
            const option = Object.freeze(this.$refs.preview.getOption());
            if (!option) {
                return;
            }
            mount(
                option,
                this.$el.querySelector('#option-outline'),
                {
                    getKeys(object, path) {
                        return Object.keys(object).filter(key => {
                            if (Array.isArray(object[key]) && !object[key].length) {
                                return false;
                            }
                            return true;
                        });
                    },
                    expandOnCreatedAndUpdated(path) {
                        return path.length === 0
                            || (path[0] === 'series' && path.length <= 1);
                    },
                }
            );
        },
        updateTabContent(tab) {
            if (tab === 'full-code') {
                this.updateFullCode();
            }
            else if (tab === 'full-option') {
                this.updateOptionOutline();
            }
        }
    },

    watch: {
        'shared.typeCheck'(enableTypeCheck) {
            // Update initialCode to avoid code changed when switching editor
            this.initialCode = store.sourceCode;
            this.updateFullCode();
        },
        'currentTab'(tab) {
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
}
</script>

<style lang="scss">

@import '../style/color.scss';

$code-info-height: 25px;
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
            height: $control-panel-height!important;
            position: relative;
            z-index: 10;
            padding: 0;
        }
        .el-main {
            padding: 0;
            position: relative;

            ::-webkit-scrollbar {
                height:8px;
                width:8px;
                transition:all 0.3s ease-in-out;
                border-radius:2px;
            }

            ::-webkit-scrollbar-button {
                display:none;
            }

            ::-webkit-scrollbar-thumb {
                width:8px;
                min-height:15px;
                background:rgba(50, 50, 50, 0.6) !important;
                transition:all 0.3s ease-in-out;border-radius:2px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background:rgba(0, 0, 0, 0.5) !important;
            }
        }
    }

    .el-tabs {
        box-shadow: none;
    }

    .el-tabs--border-card>.el-tabs__header {
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

#editor-control-panel, #full-code-generate-config {
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

    font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
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

    .editor-controls  {
        float: right;

        .el-switch__label {
            margin-top: -3px;
        }
        .el-switch__label * {
            font-size: 12px;
        }

        .btn {
            color: #FFF;
            border-radius: 0;
            background-color: #409eff;
            margin-left: $pd-basic;
            border: none;
            height: 30px;
            width: 50px;
        }
        .btn:hover {
            background-color: lighten($color: #409eff, $amount: 5);
        }
    }
}

#code-info {
    position: absolute;
    bottom: 0;
    overflow: hidden;

    height: $control-panel-height;
    line-height: $control-panel-height;
    padding: 0px 10px;

    // border-top: 1px solid $clr-border;
    font-size: 0.9rem;

    .code-info-time {
        color: $clr-text;
        display: inline-block;
        margin-right: 10px;
        font-size: 12px;
    }

    .code-info-type-info {
        color: $clr-text;
        font-size: 12px;
    }

    .code-info-type-warn {
        color: $clr-warn;
    }

    .code-info-type-error {
        color: $clr-error;
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