<template>
<div id="main-container">
    <div id="editor-left-container" :style="{width: leftContainerSize + '%'}" v-if="!shared.isMobile">
        <el-tabs v-model="currentTab" type="border-card">
            <el-tab-pane label="示例编辑" name="code-editor">
                <div id="control-panel">
                    <div id="code-info">
                        <template v-if="shared.editorStatus.message">
                            <span class="code-info-time">{{currentTime}}</span>
                            <span :class="'code-info-type-' + shared.editorStatus.type">{{shared.editorStatus.message}}</span>
                        </template>
                    </div>
                    <div class="control-btn-panel">
                        <!-- <el-switch v-model="shared.typeCheck"
                            :active-text="$t('editor.monacoMode')"
                            :inactive-text="''"
                        ></el-switch> -->
                        <a href="javascript:;" class='btn btn-default btn-sm' @click='disposeAndRun'>{{$t('editor.run')}}</a>
                    </div>
                </div>
                <CodeMonaco v-if="shared.typeCheck" id="code-panel" :initialCode="initialCode"></CodeMonaco>
                <CodeAce v-else id="code-panel" :initialCode="initialCode"></CodeAce>
            </el-tab-pane>

            <el-tab-pane label="完整代码" name="full-code" :lazy="true">
                <FullCodePreview :code="fullCode"></FullCodePreview>
            </el-tab-pane>
            <el-tab-pane label="配置项" name="full-option" :lazy="true">
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

            fullCode: ''
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
        }
    },

    watch: {
        'shared.typeCheck'(enableTypeCheck) {
            // Update initialCode to avoid code changed when switching editor
            this.initialCode = store.sourceCode;
        },
        'currentTab'(tab) {
            if (tab === 'full-code') {
                const option = this.$refs.preview.getOption();
                const deps = collectDeps(option);
                deps.push('CanvasRenderer');
                this.fullCode = buildExampleCode(store.sourceCode, deps, {
                    minimal: true,
                    ts: false,
                    ROOT_PATH: store.cdnRoot
                });
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
    }

    .el-tabs__item {
        height: 34px;
        line-height: 34px;
    }
}

#control-panel {
    height: $control-panel-height;
    position: absolute;;
    left: 0;
    right: 0;
    top: 0;
    z-index: 20;
    padding: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .setting-panel {
        display: inline-block;

        .btn-group + .btn-group {
            margin-left: $pd-basic;
        }
    }

    .control-btn-panel  {
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


#code-panel {
    position: absolute;
    top: $control-panel-height;
    bottom: 0;
    left: 0;
    right: 0;
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
    }

    .code-info-type-info {
        color: $clr-text;
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