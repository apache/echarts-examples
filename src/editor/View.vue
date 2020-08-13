<template>
<preview></Preview>
</template>

<script>

import Preview from './Preview.vue';
import {store, loadExampleCode} from '../common/store';

export default {
    components: {
        Preview
    },

    mounted() {
        loadExampleCode().then(code => {
            store.code = code;
        });
    }
}
</script>

<style lang="scss">

</style>