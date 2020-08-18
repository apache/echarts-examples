<template>
<preview></Preview>
</template>

<script>

import Preview from './Preview.vue';
import {store, loadExampleCode, parseSourceCode} from '../common/store';

export default {
    components: {
        Preview
    },

    mounted() {
        loadExampleCode().then(code => {
            store.runCode = parseSourceCode(code);
        });
    }
}
</script>

<style lang="scss">

</style>