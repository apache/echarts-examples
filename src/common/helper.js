
export function loadScriptsAsync(scripts) {
    return Promise.all(scripts.map(function (scriptUrl) {
        return new Promise((resolve, reject) => {
            if (scriptUrl.match(/\.js$/)) {
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.async = false;
                script.onload = function () {
                    resolve();
                };
                script.onerror = function () {
                    reject();
                };
                document.body.appendChild(script);
            }
            else if (scriptUrl.match(/\.css$/)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = scriptUrl;
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
