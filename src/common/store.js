
import {URL_PARAMS} from '../common/config';

export const store = {
    cdnRoot: '',
    version: '',
    locale: '',

    theme: URL_PARAMS.theme || '',
    renderer: URL_PARAMS.renderer || 'canvas',

    code: '',

    editorStatus: {
        type: '',
        message: ''
    }
};