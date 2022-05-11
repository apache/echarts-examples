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
      store.runCode = parseSourceCode(code);
    });

    this.showShareHint();
  },

  methods: {
    showShareHint() {
      if (store.isSharedCode) {
        this.$message.closeAll();
        this.$message({
          type: 'warning',
          message: this.$t('editor.share.hint'),
          duration: 5000,
          showClose: true
        });
      }
    }
  }
};
</script>

<style lang="scss"></style>
