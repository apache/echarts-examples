
import {URL_PARAMS} from '../common/config';

export const store = {
    cdnRoot: '',
    version: '',
    locale: '',

    darkMode: URL_PARAMS.theme === 'dark',
    renderer: URL_PARAMS.renderer || 'canvas',

    code: '',

    editorStatus: {
        type: '',
        message: ''
    }
};