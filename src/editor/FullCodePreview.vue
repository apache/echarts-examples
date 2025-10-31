<template>
  <div ref="full-code" class="full-code-preview" v-loading="loading"></div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  useTemplateRef,
  reactive
} from 'vue';
import { loadScriptsAsync } from '../common/helper';
import { store } from '../common/store';
import { getScriptURLs } from '../common/config';

const { code } = defineProps({
  code: String
});

const shared = reactive(store);

const fullCodeElement = useTemplateRef('full-code');

const loading = ref(false);
const editor = ref(null);

function ensureACE() {
  if (typeof ace === 'undefined') {
    const SCRIPT_URLS = getScriptURLs(shared.locale);

    return loadScriptsAsync([SCRIPT_URLS.aceDir + '/ace.js']);
  }
  return Promise.resolve();
}

onMounted(() => {
  loading.value = true;
  ensureACE().then(() => {
    loading.value = false;
    const aceEditor = ace.edit(fullCodeElement.value);
    aceEditor
      .getSession()
      .setMode(
        shared.typeCheck ? 'ace/mode/typescript' : 'ace/mode/javascript'
      );
    // https://stackoverflow.com/questions/32806060/is-there-a-programmatic-way-to-hide-the-cursor-in-ace-editor
    aceEditor.setOptions({
      readOnly: true,
      showLineNumbers: false,
      showFoldWidgets: false,
      highlightActiveLine: false,
      highlightGutterLine: false
    });
    // editor.renderer.setShowGutter(false);
    aceEditor.renderer.$cursorLayer.element.style.display = 'none';

    editor.value = aceEditor;

    setCode(code);
  });
});

function setCode(code) {
  if (editor.value) {
    editor.value.setValue(code);
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

watch(
  () => code,
  (newVal) => {
    setCode(newVal);
  }
);
</script>

<style lang="scss">
.full-code-preview {
  font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas',
    monospace;
  font-size: 12px;
  line-height: 18px;
  // height: 100%;

  // Fix safari
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>
