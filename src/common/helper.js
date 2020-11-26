
const promisesCache = {};

export function loadScriptsAsync(scripts) {
    return Promise.all(scripts.map(function (scriptUrl) {
        if (typeof scriptUrl === 'string') {
            scriptUrl = {
                url: scriptUrl,
                // TODO Not supported type
                type: scriptUrl.match(/\.css$/) ? 'css' : 'js'
            };
        }
        if (promisesCache[scriptUrl.url]) {
            return promisesCache[scriptUrl.url];
        }
        const promise = new Promise((resolve, reject) => {
            if (scriptUrl.type === 'js') {
                const script = document.createElement('script');
                script.src = scriptUrl.url;
                script.async = false;
                script.onload = function () {
                    resolve();
                };
                script.onerror = function () {
                    reject();
                };
                document.body.appendChild(script);
            }
            else if (scriptUrl.type === 'css') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = scriptUrl.url;
                link.onload = function () {
                    resolve();
                };
                link.onerror = function () {
                    reject();
                };
                document.body.appendChild(link);
            }
        });
        promisesCache[scriptUrl.url] = promise;
        return promise;
    }));
}

export function downloadBlob(blob, fileName) {
    // for IE
    if (typeof window.navigator.msSaveBlob === 'function') {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    }
    else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        // should revoke the blob url after the download
        URL.revokeObjectURL(a.href);
    }
}