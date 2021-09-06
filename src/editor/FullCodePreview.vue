<template>
  <div class="full-code-preview" v-loading="loading"></div>
</template>

<script>
import { loadScriptsAsync } from '../common/helper';
import { store } from '../common/store';
import { SCRIPT_URLS } from '../common/config';

function ensureACE() {
  if (typeof ace === 'undefined') {
    return loadScriptsAsync([SCRIPT_URLS.aceDir + '/ace.js']);
  }
  return Promise.resolve();
}

export default {
  props: ['code'],

  data() {
    return {
      shared: store,
      loading: false
    };
  },

  mounted() {
    this.loading = true;
    ensureACE().then(() => {
      this.loading = false;
      const editor = ace.edit(this.$el);
      editor
        .getSession()
        .setMode(
          store.typeCheck ? 'ace/mode/typescript' : 'ace/mode/javascript'
        );
      // https://stackoverflow.com/questions/32806060/is-there-a-programmatic-way-to-hide-the-cursor-in-ace-editor
      editor.setOptions({
        readOnly: true,
        showLineNumbers: false,
        showFoldWidgets: false,
        highlightActiveLine: false,
        highlightGutterLine: false
      });
      // editor.renderer.setShowGutter(false);
      editor.renderer.$cursorLayer.element.style.display = 'none';

      this._editor = editor;

      this.setCode(this.code);
    });
  },

  methods: {
    setCode(code) {
      if (this._editor) {
        this._editor.setValue(code);
        this._editor.selection.setSelectionRange({
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
  },

  watch: {
    code(newVal) {
      this.setCode(newVal);
    }
  }
};
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
