const fs = require('fs');
const globby = require('globby');
const path = require('path');
const puppeteer = require('puppeteer');
const matter = require('gray-matter');
const argparse = require('argparse');
const minimatch = require('minimatch');
const {execFile} = require('child_process');
const cwebpBin = require('cwebp-bin');
const util = require('util');
const chalk = require('chalk');
const sharp = require('sharp');
const fse = require('fs-extra');
const { compareImage } = require('../common/compareImage');

function optionToJson(obj, prop) {
    let json = JSON.stringify(obj, function(key, value) {
        if (typeof value === 'function') {
            return 'expr: ' + value.toString();
        }
        return value;
    }, 2);
    return json;
};
function codeSize(code) {
    return Buffer.byteLength(code, 'utf-8');
}

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
const BASE_PATH = 'file://' + __dirname;
const SCREENSHOT_PAGE_URL = path.join(BASE_PATH, `../public/screenshot.html`);
const DEFAULT_PAGE_WIDTH = 700;
const DEFAULT_PAGE_RATIO = 0.75;
const OUTPUT_IMAGE_WIDTH = 600;

const IGNORE_LOG = [
    'A cookie associated with a cross-site resource at',
    'A parser-blocking, cross site'
];

async function convertToWebP(filePath) {
    return util.promisify(execFile)(cwebpBin, [filePath, '-o', filePath.replace(/\.png$/, '.webp')]);
}

async function takeScreenshot(
    browser,
    theme,
    rootDir,
    basename,
    pageWidth,
    screenshotDelay
) {
    const thumbFolder = (theme !== 'default') ? ('thumb-' + theme) : 'thumb';
    const page = await browser.newPage();
    await page.exposeFunction('readLocalFile', async (filePath, type) => {
        filePath = filePath.replace(/^file:\/*?/, '');
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, type || 'utf8', (err, text) => {
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
        width: (pageWidth || DEFAULT_PAGE_WIDTH),
        height: (pageWidth || DEFAULT_PAGE_WIDTH) * DEFAULT_PAGE_RATIO
    });
    const url = `${SCREENSHOT_PAGE_URL}?c=${basename}&s=${sourceFolder}&t=${theme}`;
    const resourceRootPath = path.join(BASE_PATH, '../public/');
    // console.log(url);
    await page.evaluateOnNewDocument(function (resourceRootPath) {
        window.ROOT_PATH = resourceRootPath;
    }, resourceRootPath);

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
        try {
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
        }
        catch (e) {
            console.error(chalk.red(e));
            // Timeout
        }
        await waitTime(200);
        await waitTime(screenshotDelay || 0);
        const fileBase = `${rootDir}public/${sourceFolder}/${thumbFolder}/${basename}`;
        const filePathTmpRaw = `${fileBase}-tmp-raw.png`;
        const filePathTmp = `${fileBase}-tmp.png`;
        const filePath = `${fileBase}.png`;

        // Save option for further tests.
        const option = await page.evaluate(() => {
            return _$getEChartsOption()
        });
        const optionStr = optionToJson(option);
        // if (codeSize(optionStr) > 300 * 1024) {
        //     console.log(`${basename} excceeds 300kb. Not save to option json`);
        // }
        // else {
        fse.ensureDirSync(`${rootDir}public/${sourceFolder}/option/`);
        fs.writeFileSync(`${rootDir}public/${sourceFolder}/option/${basename}.json`, optionStr, 'utf-8');
        // }

        await page.screenshot({
            path: filePathTmpRaw,
            type: 'png'
        });

        await sharp(filePathTmpRaw)
            .resize(OUTPUT_IMAGE_WIDTH, OUTPUT_IMAGE_WIDTH * DEFAULT_PAGE_RATIO)
            .toFile(filePathTmp);

        const {diffRatio} = await compareImage(filePath, filePathTmp, 0.1);

        console.log(filePath);
        if (diffRatio < 0.01) {
            console.log('Not changed');
        }
        else {
            console.log(diffRatio);
            fs.copyFileSync(filePathTmp, filePath);
            await convertToWebP(filePath);
        }

        try {
            fs.unlinkSync(filePathOld);
        }
        catch (e) {}

        fs.unlinkSync(filePathTmpRaw);
        fs.unlinkSync(filePathTmp);
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

    const files = await globby(`${rootDir}public/${sourceFolder}/*.js`);

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
                            titleCN: fmResult.data.titleCN,
                            difficulty: +difficulty
                        });
                    }
                    // Do screenshot
                    if (buildThumb) {
                        promises.push(takeScreenshot(
                            browser,
                            theme,
                            rootDir,
                            basename,
                            fmResult.data.shotWidth,
                            fmResult.data.shotDelay
                        ));
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
})();