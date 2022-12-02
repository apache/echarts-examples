<template>
  <preview></preview>
</template>

<script>
import Preview from './Preview.vue';
import { store, loadExampleCode, parseSourceCode } from '../common/store';

export default {
  components: {
    Preview
  },

  mounted() {
    loadExampleCode().then((code) => {
      // set sourceCode here as there is no editor in view mode
      store.sourceCode =
        store.initialCode =
        store.runCode =
          parseSourceCode(code);
    });
  }
};
</script>
