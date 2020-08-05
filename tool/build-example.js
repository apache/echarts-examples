const fs = require('fs');
const etpl = require('etpl');
const glob = require('glob');
const path = require('path');
const marked = require('marked');
const fm = require('front-matter');
const puppeteer = require('puppeteer');
const argparse = require('argparse');
const minimatch = require('minimatch');
const {execFile} = require('child_process');
const cwebpBin = require('cwebp-bin');
const util = require('util');

const parser = new argparse.ArgumentParser({
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

const args = parser.parseArgs();
const sourceFolder = args.source || 'data';
let themeList = args.theme || 'default,light,dark';
let matchPattern = args.pattern;
if (matchPattern) {
    matchPattern = matchPattern.split(',');
}
themeList = themeList.split(',');

const tpl = fs.readFileSync(path.join(__dirname, '../public/javascripts/chart-list.tpl.js'), 'utf-8');

etpl.config({
    commandOpen: '/**',
    commandClose: '*/'
});

function waitTime(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const BUILD_THUMBS = sourceFolder === 'data' && !args.no_thumb;
// const BASE_PATH = 'http://localhost:8000/echarts/echarts-examples';
// const BASE_PATH = 'http://localhost/echarts-examples-next/';
// const SCREENSHOT_PAGE_URL = `${BASE_PATH}/public/screenshot.html`;
const BASE_PATH = 'file://' + __dirname;
const SCREENSHOT_PAGE_URL = path.join(BASE_PATH, `../public/screenshot.html`);


async function convertToWebP(filePath) {
    return util.promisify(execFile)(cwebpBin, [filePath, '-o', filePath.replace(/\.png$/, '.webp')]);
}

async function takeScreenshot(browser, theme, rootDir, basename) {
    const thumbFolder = (theme !== 'default') ? ('thumb-' + theme) : 'thumb';
    const page = await browser.newPage();
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
    const url = `${SCREENSHOT_PAGE_URL}?c=${basename}&s=${sourceFolder}&t=${theme}`;
    const resourceRootPath = path.join(BASE_PATH, '../public/');
    // console.log(url);
    await page.evaluateOnNewDocument(function (resourceRootPath) {
        window.ROOT_PATH = resourceRootPath;
    }, resourceRootPath);
    // page.on('console', msg => {
    //     const args = msg.args();
    //     const msg = ['[pageconsole]'].concat(args.map(v => v + ''));
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
        await page.goto(url, {waitUntil: 'networkidle0'});
        await waitTime(200);
        const filePath = `${rootDir}public/${sourceFolder}/${thumbFolder}/${basename}.png`;
        console.log(filePath);
        await page.screenshot({
            path: filePath,
            type: 'png',
            // quality: 80
        });
        await convertToWebP(filePath);
    }
    catch (e) {
        console.error(url);
        console.error(e.toString());
    }
    await page.close();
}

(async () => {
    const rootDir = path.join(__dirname, '../');

    // await compress(`${rootDir}public/${sourceFolder}/thumb`);
    // return;

    let browser;
    // https://github.com/GoogleChrome/puppeteer/issues/1260
    if (BUILD_THUMBS) {
        browser = await puppeteer.launch({
            headless: false,
            args: [
              '--headless',
              '--hide-scrollbars',
              '--mute-audio',
		      '--allow-file-access-from-files'
            ]
        });
    }

    // TODO puppeteer will have Navigation Timeout Exceeded: 30000ms exceeded error in these examples.
    const screenshotBlackList = [];


    glob(`${rootDir}public/${sourceFolder}/*.js`, async function (err, files) {

        const exampleList = [];

        const threadNum = 16;
        let buckets = [];
        for (let i = 0; i < files.length;) {
            const bucket = [];
            for (let k = 0; k < threadNum; k++) {
                const fileName = files[i++];
                if (!fileName) {
                    continue;
                }
                const basename = path.basename(fileName, '.js');

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

                for (const {basename} of bucket) {

                    // Remove mapbox temporary
                    if (basename.indexOf('mapbox') >= 0
                        || basename.indexOf('shanghai') >= 0
                        || basename === 'lines3d-taxi-routes-of-cape-town'
                        || basename === 'lines3d-taxi-chengdu'
                        || basename === 'map3d-colorful-cities'
                    ) {
                        continue;
                    }

                    let fmResult;
                    try {
                        const mdText = fs.readFileSync(`${rootDir}public/${sourceFolder}/meta/${basename}.md`, 'utf-8');
                        fmResult = fm(mdText);
                    }
                    catch (e) {
                        fmResult = {
                            attributes: {}
                        };
                    }

                    // const descHTML = marked(fmResult.body);

                    // Do screenshot
                    promises.push(takeScreenshot(browser, theme, rootDir, basename));

                    try {
                        const difficulty = fmResult.attributes.difficulty != null ? fmResult.attributes.difficulty : 10;
                        const category = fmResult.attributes.category.split(',').map(name => {
                            return name.trim();
                        });
                        if (!exampleList.find(item => item.id === basename)) {  // Avoid add mulitple times when has multiple themes.
                            exampleList.push({
                                category: category,
                                id: basename,
                                theme: fmResult.attributes.theme,
                                title: fmResult.attributes.title,
                                difficulty: +difficulty
                            });
                        }
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

        const code = 'var EXAMPLES' + (sourceFolder === 'data' ? ' = ' : '_GL = ') + JSON.stringify(exampleList, null, 2);
        fs.writeFileSync(path.join(__dirname, `../public/javascripts/chart-list-${sourceFolder}.js`), code, 'utf-8');
    });
})();