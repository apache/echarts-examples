var fs = require('fs');
var etpl = require('etpl');
var glob = require('glob');
var path = require('path');
var marked = require('marked');
var fm = require('front-matter');
var puppeteer = require('puppeteer');
var argparse = require('argparse');
var minimatch = require('minimatch')

var parser = new argparse.ArgumentParser({
    addHelp: true
});
parser.addArgument(['-s', '--source'], {
    help: 'Source folder'
});
parser.addArgument(['-t', '--theme'], {
    help: 'Theme list, default to be all'
});
parser.addArgument(['-p', '--pattern'], {
    help: 'Glob match patterns for generating thumb. https://github.com/isaacs/minimatch Mutiple match pattens can be splitted with ,'
});
parser.addArgument(['--no-thumb'], {
    help: 'If not generate thumbs',
    action: 'storeTrue'
});

var args = parser.parseArgs();
var sourceFolder = args.source || 'data';
var themeList = args.theme || 'default,light,dark';
var matchPattern = args.pattern;
if (matchPattern) {
    matchPattern = matchPattern.split(',');
}
themeList = themeList.split(',');

var tpl = fs.readFileSync(path.join(__dirname, '../public/javascripts/chart-list.tpl.js'), 'utf-8');

etpl.config({
    commandOpen: '/**',
    commandClose: '*/'
});

function waitTime(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

var BUILD_THUMBS = sourceFolder === 'data' && !args.no_thumb;
// var BASE_PATH = 'http://localhost:8000/echarts/echarts-examples';
// var BASE_PATH = 'http://localhost/echarts-examples-next/';
// var SCREENSHOT_PAGE_URL = `${BASE_PATH}/public/screenshot.html`;
var BASE_PATH = 'file://' + __dirname;
var SCREENSHOT_PAGE_URL = path.join(BASE_PATH, `../public/screenshot.html`);


async function takeScreenshot(browser, theme, rootDir, basename) {
    var thumbFolder = (theme !== 'default') ? ('thumb-' + theme) : 'thumb';
    var page = await browser.newPage();
    page.exposeFunction('readLocalFile', async (filePath) => {
        filePath = filePath.replace(/^file:\/*?/, '');
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, text) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(text);
                }
            });
        });
    });
    await page.setViewport({
        width: 600,
        height: 450
        // width: 700,
        // height: 525
    });
    var url = `${SCREENSHOT_PAGE_URL}?c=${basename}&s=${sourceFolder}&t=${theme}`;
    const resourceRootPath = path.join(BASE_PATH, '../public/');
    // console.log(url);
    await page.evaluateOnNewDocument(function (resourceRootPath) {
        window.ROOT_PATH = resourceRootPath;
    }, resourceRootPath);
    // page.on('console', msg => {
    //     var args = msg.args();
    //     var msg = ['[pageconsole]'].concat(args.map(v => v + ''));
    //     console.log.apply(console, msg);
    // });
    page.on('pageerror', function (err) {
        console.error('[pageerror in]', url);
        console.log(err.toString());
    });
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    console.log(`Generating ${theme} thumbs.....${basename}`);
    // https://stackoverflow.com/questions/46160929/puppeteer-wait-for-all-images-to-load-then-take-screenshot
    try {
        await page.goto(url, {'waitUntil' : 'networkidle0'});
        await waitTime(200);
        console.log(`${rootDir}public/${sourceFolder}/${thumbFolder}/${basename}.jpg`);
        await page.screenshot({
            path: `${rootDir}public/${sourceFolder}/${thumbFolder}/${basename}.jpg`,
            type: 'jpeg',
            quality: 80
        });
    }
    catch (e) {
        console.error(url);
        console.error(e.toString());
    }
    await page.close();
}

(async () => {
    // https://github.com/GoogleChrome/puppeteer/issues/1260
    if (BUILD_THUMBS) {
        var browser = await puppeteer.launch({
            headless: false,
            args: [
              '--headless',
              '--hide-scrollbars',
              '--mute-audio',
		      "--allow-file-access-from-files"
            ]
        });
    }

    // TODO puppeteer will have Navigation Timeout Exceeded: 30000ms exceeded error in these examples.
    var screenshotBlackList = [];

    var rootDir = path.join(__dirname, '../');

    glob(`${rootDir}public/${sourceFolder}/*.js`, async function (err, files) {

        var exampleList = [];

        const threadNum = 16;
        let buckets = [];
        for (var i = 0; i < files.length;) {
            const bucket = [];
            for (let k = 0; k < threadNum; k++) {
                const fileName = files[i++];
                if (!fileName) {
                    continue;
                }
                var basename = path.basename(fileName, '.js');

                if (BUILD_THUMBS
                    && screenshotBlackList.indexOf(basename) < 0
                    && (!matchPattern || matchPattern.some(function (pattern) {
                        return minimatch(basename, pattern);
                    }))
                ) {
                    bucket.push({
                        basename
                    });
                }
            }
            buckets.push(bucket);
        }

        for (let theme of themeList) {
            for (let bucket of buckets) {
                const promises = [];

                for (var {basename} of bucket) {

                    // Remove mapbox temporary
                    if (basename.indexOf('mapbox') >= 0
                        || basename.indexOf('shanghai') >= 0
                        || basename === 'lines3d-taxi-routes-of-cape-town'
                        || basename === 'lines3d-taxi-chengdu'
                        || basename === 'map3d-colorful-cities'
                    ) {
                        continue;
                    }

                    try {
                        var mdText = fs.readFileSync(`${rootDir}public/${sourceFolder}/meta/${basename}.md`, 'utf-8');
                        var fmResult = fm(mdText);
                    }
                    catch (e) {
                        var fmResult = {
                            attributes: {}
                        };
                    }

                    // var descHTML = marked(fmResult.body);

                    // Do screenshot
                    promises.push(takeScreenshot(browser, theme, rootDir, basename));

                    try {
                        var difficulty = fmResult.attributes.difficulty != null ? fmResult.attributes.difficulty : 10;
                        var category = fmResult.attributes.category.split(',').map(name => {
                            return name.trim();
                        });
                        exampleList.push({
                            category: category,
                            id: basename,
                            theme: fmResult.attributes.theme,
                            title: fmResult.attributes.title,
                            difficulty: +difficulty
                        });
                    }
                    catch (e) {
                        throw new Error(e.toString());
                    }
                }
                if (promises.length) {
                    await Promise.all(promises);
                }
            }
        }

        if (BUILD_THUMBS) {
            await browser.close();
        }

        exampleList.sort(function (a, b) {
            if (a.difficulty === b.difficulty) {
                return a.id.localeCompare(b.id);
            }
            return a.difficulty - b.difficulty;
        });

        var code = 'var EXAMPLES' + (sourceFolder === 'data' ? ' = ' : '_GL = ') + JSON.stringify(exampleList, null, 2);
        fs.writeFileSync(path.join(__dirname, `../public/javascripts/chart-list-${sourceFolder}.js`), code, 'utf-8');
    });
})();