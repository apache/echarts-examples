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
const { runTasks } = require('../common/task');
const nStatic = require('node-static');

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

const BUILD_THUMBS = !args.no_thumb;
const DEFAULT_PAGE_WIDTH = 700;
const DEFAULT_PAGE_RATIO = 0.75;
const OUTPUT_IMAGE_WIDTH = 600;

const PORT = 3323;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_PAGE_URL = `${BASE_URL}/tool/screenshot.html`;

const IGNORE_LOG = [
    // For BMap
    'A cookie associated with a cross-site resource at',
    'A parser-blocking, cross site',
    // For ECharts GL
    'RENDER WARNING',
    'GL ERROR',
    'GL_INVALID_OPERATION'
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

    await page.setViewport({
        width: (pageWidth || DEFAULT_PAGE_WIDTH),
        height: (pageWidth || DEFAULT_PAGE_WIDTH) * DEFAULT_PAGE_RATIO
    });
    const url = `${SCREENSHOT_PAGE_URL}?c=${basename}&s=${sourceFolder}&t=${theme}`;
    const resourceRootPath = `${BASE_URL}/public`;
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
            console.log(chalk.gray(`PAGE LOG[${basename}]: ${text}`));
        }
    });
    console.log(`Generating ${theme} thumbs.....${basename}`);
    // https://stackoverflow.com/questions/46160929/puppeteer-wait-for-all-images-to-load-then-take-screenshot
    try {
        try {
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 20000
            });
        }
        catch (e) {
            console.error(chalk.red(e));
            // Timeout
        }
        await waitTime(200);
        await waitTime(screenshotDelay || 0);
        const thumbDir = `${rootDir}public/${sourceFolder}/${thumbFolder}`;
        const fileBase = `${thumbDir}/${basename}`;
        const filePathTmpRaw = `${fileBase}-tmp-raw.png`;
        const filePathTmp = `${fileBase}-tmp.png`;
        const filePath = `${fileBase}.png`;

        fse.ensureDirSync(thumbDir);

        // Save option for further tests.
        try {
            const option = await page.evaluate(() => {
                return _$getEChartsOption()
            });
            const optionStr = optionToJson(option);
            fse.ensureDirSync(`${rootDir}public/${sourceFolder}/option/`);
            fs.writeFileSync(`${rootDir}public/${sourceFolder}/option/${basename}.json`, optionStr, 'utf-8');
        }
        catch (e) {
            console.error(chalk.red('Failed to generate option'));
            console.error(chalk.red(e));
        }

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
    const fileServer = new nStatic.Server(rootDir);
    const server = BUILD_THUMBS && require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    })
    server && server.listen(PORT);

    let browser;
    if (BUILD_THUMBS) {
        browser = await puppeteer.launch({
            headless: false,
            args: [
              '--headless',
              '--hide-scrollbars',
              // https://github.com/puppeteer/puppeteer/issues/4913
              '--use-gl=egl',
              '--mute-audio'
            ]
        });
    }

    // TODO puppeteer will have Navigation Timeout Exceeded: 30000ms exceeded error in these examples.
    const screenshotBlackList = [];

    const files = await globby(`${rootDir}public/${sourceFolder}/*.js`);

    const exampleList = [];

    let tasks = [];

    for (let theme of themeList) {
        for (let fileName of files) {
            const basename = path.basename(fileName, '.js');
            if (
                !matchPattern || matchPattern.some(function (pattern) {
                    return minimatch(basename, pattern);
                })
            ) {
                tasks.push({
                    buildThumb: BUILD_THUMBS && screenshotBlackList.indexOf(basename) < 0,
                    theme,
                    basename
                });
            }
        }
    }

    await runTasks(tasks, async ({basename, buildThumb, theme}) => {
        // Remove mapbox temporary
        if (basename.indexOf('mapbox') >= 0
            || basename.indexOf('shanghai') >= 0
            || basename === 'lines3d-taxi-routes-of-cape-town'
            || basename === 'lines3d-taxi-chengdu'
            || basename === 'map3d-colorful-cities'

            // TODO Examples that can't work temporary.
            || basename === 'bar3d-music-visualization'
        ) {
            return;
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
                await takeScreenshot(
                    browser,
                    theme,
                    rootDir,
                    basename,
                    fmResult.data.shotWidth,
                    fmResult.data.shotDelay
                );
            }
        }
        catch (e) {
            server.close();
            await browser.close();
            throw new Error(e.toString());
        }
    }, sourceFolder === 'data-gl' ? 2 : 16);

    if (BUILD_THUMBS) {
        server.close();
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


process.on('SIGINT', function() {
    console.log('Closing');
    // Close through ctrl + c;
    process.exit();
});