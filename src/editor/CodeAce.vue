<template>
<div class="ace-editor-main"></div>
</template>

<script>

import {keywords, fullKeywordsList} from '../data/option-keywords';
import {loadScriptsAsync} from '../common/helper';
import {store} from '../common/store';
import {SCRIPT_URLS} from '../common/config';

function ensureACE() {
    if (typeof ace === 'undefined') {
        return loadScriptsAsync([
            SCRIPT_URLS.aceDir + '/ace.js',
            SCRIPT_URLS.aceDir + '/ext-language_tools.js'
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

    data() {
        return {
            shared: store
        }
    },

    mounted() {
        ensureACE().then(() => {
            const editor = ace.edit(this.$el);
            editor.getSession().setMode('ace/mode/javascript');
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });

            this._editor = editor;

            editor.on('change', () => {
                store.code = editor.getValue();
            });

            this.setCode(store.code);
        });
    },

    methods: {
        setCode(code) {
            if (this._editor) {
                const oldCode = this._editor.getValue();
                if (oldCode !== code) {
                    this._editor.setValue(code || '');
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
    },

    watch: {
        "shared.code"(val) {
            this.setCode(val);
        }
    }
}
</script>

<style lang="scss">

</style>