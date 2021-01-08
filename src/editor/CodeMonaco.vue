<template>
<div class="monaco-editor-main" v-loading="loading"></div>
</template>

<script>

import {keywords, fullKeywordsList} from '../data/option-keywords';
import {loadScriptsAsync} from '../common/helper';
import {store} from '../common/store';
import {SCRIPT_URLS} from '../common/config';
import { ensureECharts } from './Preview.vue';

function loadTypes() {
    return fetch(store.cdnRoot + '/types/echarts.d.ts', {
        mode: 'cors'
    }).then(response => response.text()).then(code => {

        // validation settings
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false
        });

        // compiler options
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES6,
            allowNonTsExtensions: true,
            noResolve: false
        });

        // console.log('file:///node_modules/@types/' + res[i].path);
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
            code,
            // https://github.com/microsoft/monaco-editor/issues/667#issuecomment-468164794
            'file:///node_modules/@types/echarts/index.d.ts'
        );

        monaco.languages.typescript.typescriptDefaults.addExtraLib(
`import {init, EChartsOption} from 'echarts';
// Declare to global namespace.
declare global {
declare const $: any;
declare const ROOT_PATH: string;
declare const app: {
    configParameters: {
        [key: string]: ({
            options: { [key: string]: string
        }) | ({
            min?: number
            max?: number
        })
    }
    config: {
        onChange: () => void
        [key: string]: string | number | function
    }
    [key: string]: any
};
declare const myChart: ReturnType<typeof init>;
declare var option: EChartsOption;
}
`,
            'file:///example.d.ts'
        );
        return;
    });
}

function ensureMonacoAndTsTransformer() {
    function loadMonaco() {
        if (typeof monaco === 'undefined') {
            return loadScriptsAsync([
                SCRIPT_URLS.monacoDir + '/loader.js',
                // Prebuilt TS transformer with surcrase
                store.cdnRoot + '/js/example-transform-ts-bundle.js'
            ]).then(function () {
                window.require.config({ paths: { 'vs': SCRIPT_URLS.monacoDir }});
                return new Promise(resolve => {
                    window.require([
                        'vs/editor/editor.main'
                    ], function () {
                        loadTypes().then(() => {
                            resolve();
                        });
                    })
                });
            })
        }
        return Promise.resolve();
    }

    // Must load echarts before monaco. Or the AMD loader will affect loading of echarts.
    return ensureECharts().then(loadMonaco);
}

export default {

    props: ['initialCode'],

    data() {
        return {
            shared: store,
            loading: false
        }
    },

    mounted() {
        this.loading = true;
        ensureMonacoAndTsTransformer().then(() => {
            this.loading = false;
            const model = monaco.editor.createModel(
                this.initialCode || '',
                'typescript',
                // Should also be a file path so it can resolve the lib.
                monaco.Uri.parse('file:///main.ts')
            );
            const editor = monaco.editor.create(this.$el, {
                model,
                fontFamily: `'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace`,
                minimap: {
                    enabled: false
                },
                automaticLayout: true
            });

            this._editor = editor;

            if (this.initialCode) {
                store.sourceCode = this.initialCode;
                store.runCode = echartsExampleTransformTs(store.sourceCode);
            }
            editor.onDidChangeModelContent(() => {
                store.sourceCode = editor.getValue();
                store.runCode = echartsExampleTransformTs(store.sourceCode);
            });
        });
    },

    destroyed() {
        if (this._editor) {
            this._editor.getModel().dispose();
            this._editor.dispose();
        }
    },

    methods: {
        setInitialCode(code) {
            if (this._editor && code) {
                this._editor.setValue(code || '');
            }
        }
    },

    watch: {
        initialCode(newVal) {
            this.setInitialCode(newVal);
        }
    }
}
</script>

<style lang="scss">
.monaco-editor-main {
    font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 12px;
    padding: 0;
    overflow-y: hidden;
    // height: 100%;
    // Fix safari
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
}
</style>