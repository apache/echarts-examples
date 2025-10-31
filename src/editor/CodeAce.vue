<template>
  <div ref="ace-editor" class="ace-editor-main" v-loading="loading"></div>
</template>

<script setup>
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import { getScriptURLs } from '../common/config';
import { loadScriptsAsync } from '../common/helper';
import { store } from '../common/store';
import { keywords } from '../data/option-keywords';

const { initialCode } = defineProps({
  initialCode: String
});

const shared = reactive(store);
const aceEditorRef = useTemplateRef('ace-editor');
const loading = ref(false);
const editor = ref(null);

function ensureACE() {
  if (typeof ace === 'undefined') {
    const SCRIPT_URLS = getScriptURLs(shared.locale);

    return loadScriptsAsync([
      SCRIPT_URLS.aceDir + '/ace.js',
      SCRIPT_URLS.aceDir + '/ext-language_tools.js'
    ]).then(function () {
      const lnTools = ace.require('ace/ext/language_tools');

      const completions = [];
      keywords.forEach((keyword) => {
        completions.push({
          caption: keyword.name,
          value: keyword.name,
          score: keyword.count,
          metal: 'local'
        });
      });

      lnTools.addCompleter({
        getCompletions: function (editor, session, pos, prefix, callback) {
          callback(null, completions);
        }
      });
    });
  }
  return Promise.resolve();
}

onMounted(() => {
  loading.value = true;
  ensureACE().then(() => {
    const aceEditor = ace.edit(aceEditorRef.value);
    aceEditor.getSession().setMode('ace/mode/javascript');
    aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      tabSize: 2,
      enableLiveAutocompletion: true
    });

    editor.value = aceEditor;

    aceEditor.on('change', () => {
      shared.sourceCode = shared.runCode = aceEditor.getValue();
    });

    if (initialCode) setInitialCode(initialCode);

    loading.value = false;
  });
});

function setInitialCode(code) {
  if (editor.value && code) {
    editor.value.setValue(code || '');
    if (editor.value.selection && editor.value.selection.setSelectionRange) {
      editor.value.selection.setSelectionRange({
        start: {
          row: 1,
          column: 4
        },
        end: {
          row: 1,
          column: 4
        }
      });
    }
  }
}

watch(
  () => initialCode,
  (newVal) => {
    setInitialCode(newVal);
  }
);
</script>

<style lang="scss">
.ace-editor-main {
  font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas',
    monospace;
  font-size: 12px;
  line-height: 18px;
  padding: 10px;
  // height: 100%;

  // Fix safari
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>
