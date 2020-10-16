const fs = require('fs');
const glob = require('glob');
const path = require('path');
// const marked = require('marked');
const puppeteer = require('puppeteer');
const matter = require('gray-matter');
const argparse = require('argparse');
const minimatch = require('minimatch');
const {execFile} = require('child_process');
const cwebpBin = require('cwebp-bin');
const util = require('util');
const chalk = require('chalk');

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
let themeList = args.theme || 'default,dark';
let matchPattern = args.pattern;
if (matchPattern) {
    matchPattern = matchPattern.split(',');
}
themeList = themeList.split(',');

function waitTime(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

const BUILD_THUMBS = sourceFolder === 'data' && !args.no_thumb;
// const BASE_PATH = 'http://localhost:8000/echarts/echarts-examples';
// const BASE_PATH = 'http://localhost/echarts-examples-next/';
// const SCREENSHOT_PAGE_URL = `${BASE_PATH}/public/screenshot.html`;
const BASE_PATH = 'file://' + __dirname;
const SCREENSHOT_PAGE_URL = path.join(BASE_PATH, `../public/screenshot.html`);

const IGNORE_LOG = [
    'A cookie associated with a cross-site resource at',
    'A parser-blocking, cross site'
];

async function convertToWebP(filePath) {
    return util.promisify(execFile)(cwebpBin, [filePath, '-o', filePath.replace(/\.png$/, '.webp')]);
}

async function takeScreenshot(browser, theme, rootDir, basename) {
    const thumbFolder = (theme !== 'default') ? ('thumb-' + theme) : 'thumb';
    const page = await browser.newPage();
    await page.exposeFunction('readLocalFile', async (filePath) => {
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
        console.error(chalk.red('[pageerror in]', url));
        console.error(chalk.red(err.toString()));
    });
    page.on('console', msg => {
        const text = msg.text();
        if (!IGNORE_LOG.find(a => text.indexOf(a) >= 0)) {
            console.log('PAGE LOG:', text);
        }
    });
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

        const threadNum = BUILD_THUMBS ? 16 : 1;
        let buckets = [];
        for (let i = 0; i < files.length;) {
            const bucket = [];
            for (let k = 0; k < threadNum; k++) {
                const fileName = files[i++];
                if (!fileName) {
                    continue;
                }
                const basename = path.basename(fileName, '.js');

                if (
                    !matchPattern || matchPattern.some(function (pattern) {
                        return minimatch(basename, pattern);
                    })
                ) {
                    bucket.push({
                        buildThumb: BUILD_THUMBS && screenshotBlackList.indexOf(basename) < 0,
                        basename
                    });
                }
            }
            buckets.push(bucket);
        }

        for (let theme of themeList) {
            for (let bucket of buckets) {
                const promises = [];

                for (const {basename, buildThumb} of bucket) {

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
                        const code = fs.readFileSync(`${rootDir}public/${sourceFolder}/${basename}.js`, 'utf-8');
                        fmResult = matter(code, {
                            delimiters: ['/*', '*/']
                        });
                    }
                    catch (e) {
                        fmResult = {
                            data: {}
                        };
                    }

                    // const descHTML = marked(fmResult.body);

                    // Do screenshot
                    if (buildThumb) {
                        promises.push(takeScreenshot(browser, theme, rootDir, basename));
                    }

                    try {
                        const difficulty = fmResult.data.difficulty != null ? fmResult.data.difficulty : 10;
                        const category = (fmResult.data.category || '').split(/,/g).map(a => a.trim()).filter(a => !!a);
                        if (!exampleList.find(item => item.id === basename)) {  // Avoid add mulitple times when has multiple themes.
                            exampleList.push({
                                category: category,
                                id: basename,
                                tags: (fmResult.data.tags || '').split(/,/g).map(a => a.trim()).filter(a => !!a),
                                theme: fmResult.data.theme,
                                title: fmResult.data.title,
                                difficulty: +difficulty
                            });
                        }
                    }
                    catch (e) {
                        await browser.close();
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

        const code = `
/* eslint-disable */
// THIS FILE IS GENERATED, DON'T MODIFY */
export default ${JSON.stringify(exampleList, null, 2)}`;
        if (!matchPattern) {
            fs.writeFileSync(path.join(__dirname, `../src/data/chart-list-${sourceFolder}.js`), code, 'utf-8');
        }
    });
})();