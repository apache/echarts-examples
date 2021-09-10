<template>
  <div class="monaco-editor-main" v-loading="loading"></div>
</template>

<script>
import { loadScriptsAsync } from '../common/helper';
import { store } from '../common/store';
import { SCRIPT_URLS, URL_PARAMS } from '../common/config';
import { ensureECharts } from './Preview.vue';

function loadTypes() {
  return fetch(
    ('local' in URL_PARAMS
      ? SCRIPT_URLS.localEChartsDir
      : SCRIPT_URLS.echartsDir.replace('{{version}}', store.echartsVersion)) +
      '/types/dist/echarts.d.ts',
    {
      mode: 'cors'
    }
  )
    .then((response) => response.text())
    .then((code) => {
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
        'file:///node_modules/@types/echarts/echarts.d.ts'
      );

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `
import * as echarts from './echarts';
// Export for UMD module.
export as namespace echarts
export = echarts;`,
        // https://github.com/microsoft/monaco-editor/issues/667#issuecomment-468164794
        'file:///node_modules/@types/echarts/index.d.ts'
      );

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `import * as echarts from 'echarts';
// Declare to global namespace.
declare global {
    const ROOT_PATH: string
    const $: any
    const app: {
        configParameters: {
            [key: string]: {
                options: Record<string, string> | string[]
            } | {
                min?: number
                max?: number
            }
        },
        config: {
            onChange: () => void
            [key: string]: string | number | Function
        },
        onresize: () => void,
        [key: string]: any
    };

    const ecStat: any;
    const d3: any;
    const myChart: echarts.ECharts
    let option: echarts.EChartsOption

    const echarts: typeof echarts
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
        window.require.config({ paths: { vs: SCRIPT_URLS.monacoDir } });
        return new Promise((resolve) => {
          window.require(['vs/editor/editor.main'], function () {
            loadTypes().then(() => {
              // Disable AMD. Which will break other libs.
              // FIXME
              window.define.amd = null;
              resolve();
            });
          });
        });
      });
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
    };
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
        wordWrap: 'off',
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
        // this._editor.setValue(code || '');

        // https://github.com/microsoft/monaco-editor/issues/299#issuecomment-268423927
        this._editor.executeEdits('replace', [
          {
            identifier: 'delete',
            range: new monaco.Range(1, 1, 10000, 1),
            text: '',
            forceMoveMarkers: true
          }
        ]);
        this._editor.executeEdits('replace', [
          {
            identifier: 'insert',
            range: new monaco.Range(1, 1, 1, 1),
            text: code,
            forceMoveMarkers: true
          }
        ]);
        this._editor.setSelection(new monaco.Range(0, 0, 0, 0));
        // this._editor.setPosition(currentPosition);
      }
    }
  },

  watch: {
    initialCode(newVal) {
      this.setInitialCode(newVal);
    }
  }
};
</script>

<style lang="scss">
.monaco-editor-main {
  font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas',
    monospace;
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
