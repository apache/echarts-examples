<template>
  <preview></preview>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { loadExampleCode, parseSourceCode, store } from '../common/store';
import Preview from './Preview.vue';

const shared = reactive(store);

onMounted(() => {
  loadExampleCode().then((code) => {
    // set sourceCode here as there is no editor in view mode
    shared.sourceCode =
      shared.initialCode =
      shared.runCode =
        parseSourceCode(code);
  });
});
</script>
