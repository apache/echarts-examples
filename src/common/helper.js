
export function loadScriptsAsync(scripts) {
    return Promise.all(scripts.map(function (scriptUrl) {
        if (typeof scriptUrl === 'string') {
            scriptUrl = {
                url: scriptUrl,
                // TODO Not supported type
                type: scriptUrl.match(/\.css$/) ? 'css' : 'js'
            };
        }
        return new Promise((resolve, reject) => {
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
    }));
}
