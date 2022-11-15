const fs = require('fs');
const globby = require('globby');
const path = require('path');
const puppeteer = require('puppeteer');
const matter = require('gray-matter');
const argparse = require('argparse');
const minimatch = require('minimatch');
const { execFile } = require('child_process');
const cwebpBin = require('cwebp-bin');
const util = require('util');
const chalk = require('chalk');
const sharp = require('sharp');
const fse = require('fs-extra');
const { compareImage } = require('../common/compareImage');
const { runTasks } = require('../common/task');
const nStatic = require('node-static');
const shell = require('shelljs');

function optionToJson(obj, prop) {
  let json = JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === 'function') {
        return 'expr: ' + value.toString();
      }
      return value;
    },
    2
  );
  return json;
}
function codeSize(code) {
  return Buffer.byteLength(code, 'utf-8');
}

const parser = new argparse.ArgumentParser({
  addHelp: true
});
parser.addArgument(['--gl'], {
  help: 'If generating gl',
  action: 'storeTrue'
});
parser.addArgument(['-t', '--theme'], {
  help: 'Theme list, default to be all'
});
parser.addArgument(['-p', '--pattern'], {
  help: 'Glob match patterns for generating thumb. https://github.com/isaacs/minimatch Multiple match pattens can be split with ,'
});
parser.addArgument(['--no-thumb'], {
  help: 'If not generate thumbs',
  action: 'storeTrue'
});

const args = parser.parseArgs();
const isGL = args.gl;
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
const OUTPUT_IMAGE_HEIGHT = OUTPUT_IMAGE_WIDTH * DEFAULT_PAGE_RATIO;

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

function checkHasVideo(videoStart, videoEnd) {
  return !isNaN(videoStart) && !isNaN(videoEnd) && +videoEnd > +videoStart;
}

async function convertToWebP(filePath) {
  return util.promisify(execFile)(cwebpBin, [
    filePath,
    '-o',
    filePath.replace(/\.png$/, '.webp')
  ]);
}

async function takeScreenshot(
  browser,
  ffmpeg,
  theme,
  rootDir,
  basename,
  hasVideo,
  // Shot parameters
  { shotWidth, shotDelay, videoStart, videoEnd }
) {
  const thumbFolder = theme !== 'default' ? 'thumb-' + theme : 'thumb';
  const page = await browser.newPage();
  const dataDir = isGL ? 'data-gl' : 'data';
  const thumbDir = `${rootDir}public/${dataDir}/${thumbFolder}`;
  const fileBase = `${thumbDir}/${basename}`;
  const webmFile = `${fileBase}.webm`;

  function checkDownloadFile() {
    return new Promise((resolve) => {
      let timeout = 0;
      function check() {
        if (fs.existsSync(webmFile)) {
          resolve();
          return;
        }
        timeout += 100;
        if (timeout >= 20000 + +videoEnd) {
          console.error(fileBase + '.webm download timeout.');
          resolve();
          return;
        }

        setTimeout(check, 100);
      }
      setTimeout(check, 100);
    });
  }

  let checkingDownload;

  await page.setViewport({
    width: shotWidth || DEFAULT_PAGE_WIDTH,
    height: (shotWidth || DEFAULT_PAGE_WIDTH) * DEFAULT_PAGE_RATIO
  });
  let url = `${SCREENSHOT_PAGE_URL}?c=${basename}&t=${theme}${
    isGL ? '&gl' : ''
  }`;

  if (hasVideo) {
    url += `&start=${videoStart}&end=${videoEnd}`;
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: thumbDir
    });

    checkingDownload = checkDownloadFile();
  }

  const resourceRootPath = `${BASE_URL}/public`;
  // console.log(url);
  await page.evaluateOnNewDocument(function (resourceRootPath) {
    window.ROOT_PATH = resourceRootPath;
  }, resourceRootPath);

  page.on('pageerror', function (err) {
    console.error(chalk.red('[pageerror in]', url));
    console.error(chalk.red(err.toString()));
  });
  page.on('console', (msg) => {
    const text = msg.text();
    if (!IGNORE_LOG.find((a) => text.indexOf(a) >= 0)) {
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
    } catch (e) {
      console.error(chalk.red(e));
      // Timeout
    }
    await waitTime(200);
    await waitTime(shotDelay || 0);
    const filePathTmpRaw = `${fileBase}-tmp-raw.png`;
    const filePathTmp = `${fileBase}-tmp.png`;
    const filePath = `${fileBase}.png`;

    fse.ensureDirSync(thumbDir);

    // Save option for further tests.
    try {
      const option = await page.evaluate(() => {
        return _$getEChartsOption();
      });
      const optionStr = optionToJson(option);
      fse.ensureDirSync(`${rootDir}public/${dataDir}/option/`);
      fs.writeFileSync(
        `${rootDir}public/${dataDir}/option/${basename}.json`,
        optionStr,
        'utf-8'
      );
    } catch (e) {
      console.error(chalk.red('Failed to generate option'));
      console.error(chalk.red(e));
    }

    await page.screenshot({
      path: filePathTmpRaw,
      type: 'png'
    });

    await sharp(filePathTmpRaw)
      .resize(OUTPUT_IMAGE_WIDTH, OUTPUT_IMAGE_HEIGHT)
      .toFile(filePathTmp);

    const { diffRatio } = await compareImage(filePath, filePathTmp, 0.1);

    console.log(filePath);
    if (diffRatio < 0.01) {
      console.log('Not changed');
    } else {
      console.log(diffRatio);
      fs.copyFileSync(filePathTmp, filePath);
      if (!hasVideo) {
        await convertToWebP(filePath);
      }
    }

    try {
      fs.unlinkSync(filePathOld);
    } catch (e) {}

    fs.unlinkSync(filePathTmpRaw);
    fs.unlinkSync(filePathTmp);

    if (hasVideo) {
      await checkingDownload;
      // const webpFile = `${fileBase}.webp`;
      // const fileContent = fs.readFileSync(webmFile);
      // ffmpeg.FS('writeFile', `${basename}.webm`, await fetchFile(fileContent));
      // await ffmpeg.run('-i', `${basename}.webm`, '-f', 'webp', '-s', `${OUTPUT_IMAGE_WIDTH}x${OUTPUT_IMAGE_HEIGHT}`, `${basename}.webp`);
      // fs.writeFileSync(webpFile, ffmpeg.FS('readFile', `${basename}.webp`));
      // ffmpeg.FS("unlink", `${basename}.webm`)
      // ffmpeg.FS("unlink", `${basename}.webp`)
      shell.exec(
        `ffmpeg -y -i ${fileBase}.webm -s ${OUTPUT_IMAGE_WIDTH}x${OUTPUT_IMAGE_HEIGHT} -f webp ${fileBase}.webp`
      );
      try {
        fs.unlinkSync(webmFile);
      } catch (e) {}
    }
  } catch (e) {
    console.error(url);
    console.error(e.toString());
  }
  await page.close();
}

(async () => {
  const rootDir = path.join(__dirname, '../');
  // TODO puppeteer will have Navigation Timeout Exceeded: 30000ms exceeded error in these examples.
  const screenshotBlackList = [];

  const examplesRoot = `${rootDir}public/examples`;
  const files = await globby(`js/${isGL ? 'gl/' : ''}*.js`, {
    cwd: examplesRoot,
    absolute: true
  });

  const exampleList = [];

  let thumbTasks = [];

  for (let theme of themeList) {
    for (let fileName of files) {
      const basename = path.basename(fileName, '.js');

      // Remove mapbox temporary
      if (
        basename.indexOf('mapbox') >= 0 ||
        basename.indexOf('shanghai') >= 0 ||
        basename === 'lines3d-taxi-routes-of-cape-town' ||
        basename === 'lines3d-taxi-chengdu' ||
        basename === 'map3d-colorful-cities' ||
        // TODO Examples that can't work temporary.
        basename === 'bar3d-music-visualization'
      ) {
        continue;
      }

      const tsFile = `${examplesRoot}/ts/${isGL ? 'gl/' : ''}${basename}.ts`;
      const hasTs = fs.existsSync(tsFile);

      let fmResult;
      try {
        const code = fs.readFileSync(fileName, 'utf-8');
        fmResult = matter(code, {
          delimiters: ['/*', '*/']
        });
      } catch (e) {
        fmResult = {
          data: {}
        };
      }

      try {
        const difficulty =
          fmResult.data.difficulty != null ? fmResult.data.difficulty : 10;
        const category = (fmResult.data.category || '')
          .split(/,/g)
          .map((a) => a.trim())
          .filter((a) => !!a);
        if (!exampleList.find((item) => item.id === basename)) {
          // Avoid add multiple times when has multiple themes.
          exampleList.push({
            category: category,
            id: basename,
            ts: hasTs,
            tags: (fmResult.data.tags || '')
              .split(/,/g)
              .map((a) => a.trim())
              .filter((a) => !!a),
            theme: fmResult.data.theme,
            title: fmResult.data.title,
            titleCN: fmResult.data.titleCN,
            difficulty: +difficulty
          });
        }
      } catch (e) {
        throw new Error(e.toString());
      }

      if (
        !matchPattern ||
        (matchPattern.some(function (pattern) {
          return minimatch(basename, pattern);
        }) &&
          screenshotBlackList.indexOf(basename) < 0)
      ) {
        thumbTasks.push({
          theme,
          fmResult,
          basename
        });
      }
    }
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
    fs.writeFileSync(
      path.join(
        __dirname,
        `../src/data/chart-list-data${isGL ? '-gl' : ''}.js`
      ),
      code,
      'utf-8'
    );
  }

  // Do screenshot
  if (BUILD_THUMBS) {
    const fileServer = new nStatic.Server(rootDir);
    const server =
      BUILD_THUMBS &&
      require('http').createServer(function (request, response) {
        request
          .addListener('end', function () {
            fileServer.serve(request, response);
          })
          .resume();
      });
    server && server.listen(PORT);

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--headless',
        '--hide-scrollbars',
        // https://github.com/puppeteer/puppeteer/issues/4913
        '--use-gl=egl',
        '--mute-audio'
      ]
    });

    let ffmpeg;
    // const ffmpeg = createFFmpeg({ log: true });
    // await ffmpeg.load();

    try {
      // Take screenshots
      const animationTasks = thumbTasks.filter((task) => {
        return checkHasVideo(
          task.fmResult.data.videoStart,
          task.fmResult.data.videoEnd
        );
      });
      const staticTasks = thumbTasks.filter((task) => {
        return !checkHasVideo(
          task.fmResult.data.videoStart,
          task.fmResult.data.videoEnd
        );
      });
      await runTasks(
        staticTasks,
        async ({ basename, fmResult, theme }) => {
          await takeScreenshot(
            browser,
            ffmpeg,
            theme,
            rootDir,
            basename,
            false,
            {
              shotWidth: fmResult.data.shotWidth,
              shotDelay: fmResult.data.shotDelay
            }
          );
        },
        isGL ? 2 : 16
      );

      await runTasks(
        animationTasks,
        async ({ basename, fmResult, theme }) => {
          await takeScreenshot(
            browser,
            ffmpeg,
            theme,
            rootDir,
            basename,
            true,
            {
              shotWidth: fmResult.data.shotWidth,
              shotDelay: fmResult.data.shotDelay,
              videoStart: fmResult.data.videoStart,
              videoEnd: fmResult.data.videoEnd
            }
          );
        },
        1
      ); // Webm download seems has issue used with multithreads
    } catch (e) {
      server.close();
      await browser.close();
      throw new Error(e.toString());
    }

    server.close();
    await browser.close();
    // ffmpeg.exit(0);
  }
})();

process.on('SIGINT', function () {
  console.log('Closing');
  server.close();
  // Close through ctrl + c;
  process.exit();
});
