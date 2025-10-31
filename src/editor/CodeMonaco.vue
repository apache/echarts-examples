<template>
  <div ref="monaco-editor" class="monaco-editor-main" v-loading="loading"></div>
</template>

<script setup>
import {
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  useTemplateRef,
  watch
} from 'vue';
import { URL_PARAMS, getScriptURLs } from '../common/config';
import { loadScriptsAsync } from '../common/helper';
import { store } from '../common/store';

const { initialCode } = defineProps({
  initialCode: String
});

const shared = reactive(store);

const monacoEditorRef = useTemplateRef('monaco-editor');

const loading = ref(false);
const editor = ref(null);

const emit = defineEmits(['ready']);

function loadTypes() {
  const SCRIPT_URLS = getScriptURLs(shared.locale);
  const isLocal = 'local' in URL_PARAMS;

  return fetch(
    // ('local' in URL_PARAMS
    //   ? SCRIPT_URLS.localEChartsDir
    //   : SCRIPT_URLS[
    //       store.echartsVersion.indexOf('dev') > -1
    //         ? 'echartsNightlyDir'
    //         : 'echartsDir'
    //     ].replace('{{version}}', store.echartsVersion))
    (isLocal ? SCRIPT_URLS.localEChartsDir : SCRIPT_URLS.latestEChartsDir) +
      '/types/dist/echarts.d.ts',
    {
      mode: 'cors'
    }
  )
    .then((response) => response.text())
    .then((code) => {
      const tsLang = monaco.languages.typescript;
      const typescriptDefaults = tsLang.typescriptDefaults;
      // validation settings
      typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      });

      // compiler options
      typescriptDefaults.setCompilerOptions({
        target: tsLang.ScriptTarget.ES6,
        allowNonTsExtensions: true,
        noResolve: false
      });

      typescriptDefaults.addExtraLib(
        code,
        // https://github.com/microsoft/monaco-editor/issues/667#issuecomment-468164794
        'file:///node_modules/@types/echarts/echarts.d.ts'
      );

      typescriptDefaults.addExtraLib(
        `
import * as echarts from './echarts';
// Export for UMD module.
export as namespace echarts
export = echarts;`,
        // https://github.com/microsoft/monaco-editor/issues/667#issuecomment-468164794
        'file:///node_modules/@types/echarts/index.d.ts'
      );

      typescriptDefaults.addExtraLib(
        `import * as echarts from 'echarts';
// Declare to global namespace.
declare global {
    const ROOT_PATH: string
    const CDN_PATH: string
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
    let css: string
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
  if (typeof monaco === 'undefined') {
    const SCRIPT_URLS = getScriptURLs(shared.locale);

    return loadScriptsAsync([
      SCRIPT_URLS.monacoDir + '/loader.js',
      // Prebuilt TS transformer with sucrase
      shared.cdnRoot + '/js/example-transform-ts-bundle.js'
    ]).then(function () {
      window.require.config({
        paths: {
          vs: SCRIPT_URLS.monacoDir
        },
        'vs/nls': {
          availableLanguages: {
            '*': shared.locale === 'zh' ? 'zh-cn' : undefined
          }
        }
      });
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

onMounted(() => {
  loading.value = true;
  ensureMonacoAndTsTransformer().then(() => {
    const model = monaco.editor.createModel(
      initialCode || '',
      'typescript',
      // Should also be a file path so it can resolve the lib.
      monaco.Uri.parse('file:///main.ts')
    );
    const monacoEditor = monaco.editor.create(monacoEditorRef.value, {
      model,
      fontFamily: `'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace`,
      minimap: {
        enabled: false
      },
      wordWrap: 'off',
      automaticLayout: true,
      fixedOverflowWidgets: true
    });

    editor.value = monacoEditor;

    if (initialCode) {
      shared.sourceCode = initialCode;
      shared.runCode = echartsExampleTransformTs(shared.sourceCode);
    }
    monacoEditor.onDidChangeModelContent(() => {
      shared.sourceCode = monacoEditor.getValue();
      shared.runCode = echartsExampleTransformTs(shared.sourceCode);
    });

    loading.value = false;
    emit('ready');
  });
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.getModel().dispose();
    editor.value.dispose();
  }
});

const setInitialCode = (code) => {
  if (editor.value && code) {
    // this._editor.setValue(code || '');

    // https://github.com/microsoft/monaco-editor/issues/299#issuecomment-268423927
    editor.value.executeEdits('replace', [
      {
        identifier: 'delete',
        range: new monaco.Range(1, 1, 10000, 1),
        text: '',
        forceMoveMarkers: true
      }
    ]);
    editor.value.executeEdits('replace', [
      {
        identifier: 'insert',
        range: new monaco.Range(1, 1, 1, 1),
        text: code,
        forceMoveMarkers: true
      }
    ]);
    editor.value.setSelection(new monaco.Range(0, 0, 0, 0));
    // this._editor.setPosition(currentPosition);
  }
};

watch(
  () => initialCode,
  (newVal) => {
    setInitialCode(newVal);
  }
);
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

.overflowingContentWidgets {
  position: relative;
  z-index: 20000;
}
</style>
