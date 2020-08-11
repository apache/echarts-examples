<template>
<div class="ace-editor-main"></div>
</template>

<script>

import {keywords, fullKeywordsList} from '../data/option-keywords';
import {loadScriptsAsync} from '../common/helper';

function ensureACE() {
    if (typeof ace === 'undefined') {
        return loadScriptsAsync([
            '//cdn.jsdelivr.net/npm/ace-builds@1.2.5/src-noconflict/ace.js',
            '//cdn.jsdelivr.net/npm/ace-builds@1.2.5/src-noconflict/ext-language_tools.js'
        ]).then(function () {
            const lnTools = ace.require('ace/ext/language_tools');

            const completions = [];
            for (let key in keywords) {
                completions.push({
                    caption: key,
                    value: key,
                    score: keywords[key],
                    metal: 'local'
                });
            }

            lnTools.addCompleter({
                getCompletions: function (editor, session, pos, prefix, callback) {
                    callback(null, completions);
                }
            });
        })
    }
    return Promise.resolve();
}

export default {
    props: ['code'],

    mounted() {
        ensureACE().then(() => {
            const editor = ace.edit(this.$el, {
                mode: 'ace/mode/javascript'
            });
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });

            this._editor = editor;

            editor.setValue(this.code || '');

            editor.on('change', () => {
                this.$emit('change', editor.getValue());
            });
        });
    },

    watch: {
        code(val) {
            this._editor.setValue(val || '');

            this._editor.selection.setSelectionRange({
                start: {
                    row:1,
                    column: 4
                }, end: {
                    row:1,
                    column: 4
                }
            });
        }
    }
}
</script>

<style lang="scss">

</style>