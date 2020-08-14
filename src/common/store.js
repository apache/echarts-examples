
import {URL_PARAMS} from '../common/config';

export const store = {
    cdnRoot: '',
    version: '',
    locale: '',

    darkMode: URL_PARAMS.theme === 'dark',
    renderer: URL_PARAMS.renderer || 'canvas',

    useMonaco: URL_PARAMS.editor === 'monaco',

    code: '',

    editorStatus: {
        type: '',
        message: ''
    }
};

export function loadExampleCode() {
    return new Promise(resolve => {
        const dataRoot = URL_PARAMS.gl ? 'data-gl' : 'data';
        $.ajax(`${store.cdnRoot}/${dataRoot}/${URL_PARAMS.c}.js?_v_${store.version}`, {
            dataType: 'text',
            success: (data) => {
                resolve(data);
            }
        });
    });
}