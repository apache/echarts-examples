const fs = require('fs');
const globby = require('globby');
const path = require('path');
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
const assert = require('assert');

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
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: thumbDir
    });

    checkingDownload = checkDownloadFile();
  }

  const resourceRootPath = `${BASE_URL}/public`;
  // console.log(url);
  await page.evaluateOnNewDocument(function (resourceRootPath) {
    window.ROOT_PATH = resourceRootPath;
    window.CDN_PATH = 'https://fastly.jsdelivr.net/npm/';
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
      console.error(chalk.red('Failed to generate option ' + fileBase));
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
      console.log('Running ffmpeg to convert webm to webp');
      try {
        shell.exec(
          `ffmpeg -y -i "${fileBase}.webm" -s ${OUTPUT_IMAGE_WIDTH}x${OUTPUT_IMAGE_HEIGHT} -f webp "${fileBase}.webp"`
        );
      } catch (e) {
        console.error(e);
      }
      console.log(`WebP file created: ${fileBase}.webp`);
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

  let server; // Declare server at function scope

  const examplesRoot = `${rootDir}public/examples`;
  const filesPrimary = await globby(`js/${isGL ? 'gl/' : ''}*.js`, {
    cwd: examplesRoot,
    absolute: true
  });
  const filesPrimaryBasePath = path.join(examplesRoot, `js${isGL ? '/gl' : ''}`);
  const filesInDocExampleFolder = isGL ? [] : await globby(`js/doc-example/*.js`, {
    cwd: examplesRoot,
    absolute: true
  });
  const filesInDocExampleFolderBasePath = path.join(examplesRoot, 'js');

  const exampleList = [];
  const thumbTasks = [];

  for (const theme of themeList) {
    for (const fileAbsPath of filesPrimary) {
      handleSingleFile(fileAbsPath, filesPrimaryBasePath, theme, false);
    }
  }
  for (const fileAbsPath of filesInDocExampleFolder) {
    handleSingleFile(fileAbsPath, filesInDocExampleFolderBasePath, null, true);
  }

  function handleSingleFile(fileAbsPath, fileAbsBasePath, thumbTheme, forceNoExplore) {
    const relativePath = path.relative(fileAbsBasePath, fileAbsPath);
    assert(relativePath !== '' && relativePath.indexOf('.') !== 0 && !path.isAbsolute(relativePath));
    const exampleId = relativePath.replace(/\.js$/, '');

    // Remove mapbox temporary
    if (
      exampleId.indexOf('mapbox') >= 0 ||
      exampleId.indexOf('shanghai') >= 0 ||
      exampleId === 'lines3d-taxi-routes-of-cape-town' ||
      exampleId === 'lines3d-taxi-chengdu' ||
      exampleId === 'map3d-colorful-cities' ||
      // TODO Examples that can't work temporary.
      exampleId === 'bar3d-music-visualization'
    ) {
      return;
    }

    const tsFile = path.normalize(`${examplesRoot}/ts/${isGL ? 'gl/' : ''}${exampleId}.ts`);
    const hasTs = fs.existsSync(tsFile);

    let fmResult;
    try {
      const code = fs.readFileSync(fileAbsPath, 'utf-8');
      fmResult = matter(code, {
        delimiters: ['/*', '*/']
      });
    } catch (e) {
      fmResult = {
        data: {}
      };
    }

    // `fmResult.data.noExplore` is boolean if writing `/* noExplore: true */` in code.
    const noExplore = forceNoExplore || fmResult.data.noExplore;

    try {
      const difficulty =
        fmResult.data.difficulty != null ? fmResult.data.difficulty : 10;
      const category = (fmResult.data.category || '')
        .split(/,/g)
        .map((a) => a.trim())
        .filter((a) => !!a);

      if (!exampleList.find((item) => item.id === exampleId)) {
        // Avoid add multiple times when has multiple themes.
        exampleList.push({
          category: category,
          id: exampleId,
          ts: hasTs,
          tags: (fmResult.data.tags || '')
            .split(/,/g)
            .map((a) => a.trim())
            .filter((a) => !!a),
          noExplore: noExplore,
          theme: fmResult.data.theme,
          title: fmResult.data.title,
          titleCN: fmResult.data.titleCN,
          difficulty: +difficulty,
          since: fmResult.data.since,
        });
      }
    } catch (e) {
      throw new Error(e.toString());
    }

    if (
      !noExplore
      && (
        !matchPattern
        || (
          matchPattern.some(function (pattern) {
            return minimatch(exampleId, pattern);
          })
          && screenshotBlackList.indexOf(exampleId) < 0
        )
      )
    ) {
      thumbTasks.push({
        thumbTheme,
        fmResult,
        exampleId
      });
    }
  } // End of handleSingleFile

  exampleList.sort(function (a, b) {
    const aNoExplore = a.noExplore ? 1 : 0;
    const bNoExplore = b.noExplore ? 1 : 0;
    if (aNoExplore !== bNoExplore) {
      return aNoExplore - bNoExplore;
    }
    if (a.difficulty === b.difficulty) {
      return a.id.localeCompare(b.id);
    }
    return a.difficulty - b.difficulty;
  });

  const code = `
/* eslint-disable */

// -------------------------------------------------
// ! THIS FILE IS AUTO-GENERATED. DO NOT MODIFY IT !
// -------------------------------------------------

export default ${JSON.stringify(exampleList, null, 2)}
`;

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
    server =
      BUILD_THUMBS &&
      require('http').createServer(function (request, response) {
        request
          .addListener('end', function () {
            fileServer.serve(request, response);
          })
          .resume();
      });
    server && server.listen(PORT);

    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--headless', // If network error always happens, try to comment this line to use headful mode
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

  process.on('SIGINT', function () {
    console.log('Closing');
    if (server) {
      server.close();
    }
    // Close through ctrl + c;
    process.exit();
  });
})();
