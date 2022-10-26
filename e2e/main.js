// TODO Specify echarts path

const fs = require('fs');
const globby = require('globby');
const { buildExampleCode, collectDeps } = require('../common/buildCode');
const nodePath = require('path');
const { runTasks } = require('../common/task');
const fse = require('fs-extra');
const prettier = require('prettier');
const ts = require('typescript');
const chalk = require('chalk');
const nStatic = require('node-static');
const webpack = require('webpack');
const { RawSource } = require('webpack-sources');
const argparse = require('argparse');
const esbuild = require('esbuild');
const puppeteer = require('puppeteer');
const config = require('./config');
const { compareImage } = require('../common/compareImage');
const shell = require('shelljs');
const downloadGit = require('download-git-repo');
const { promisify } = require('util');
const matter = require('gray-matter');
const minimatch = require('minimatch');

const parser = new argparse.ArgumentParser({
  addHelp: true
});
parser.addArgument(['--bundler'], {
  help: 'Bundler, can be webpack or esbuild'
});
parser.addArgument(['-m', '--minify'], {
  action: 'storeTrue',
  help: 'If minify'
});
parser.addArgument(['--local'], {
  action: 'storeTrue',
  help: `If use local repos. If so, don't forget to update the location of local repo in config.js.`
});
parser.addArgument(['--skip'], {
  help: 'If skip some stages to speed up the test. Can be npm,bundle,render,compare'
});
parser.addArgument(['-t', '--tests'], {
  help: 'If use pattern to specify which tests to run'
});
const args = parser.parseArgs();

const PUBLIC_DIR = nodePath.resolve(`${__dirname}/../public`);
const EXAMPLE_DIR = nodePath.resolve(`${PUBLIC_DIR}/examples`);
const TMP_DIR = `${__dirname}/tmp`;
const RUN_CODE_DIR = `${TMP_DIR}/tests`;
const BUNDLE_DIR = `${TMP_DIR}/bundles`;
const SCREENSHOTS_DIR = `${TMP_DIR}/screenshots`;
const REPO_DIR = `${TMP_DIR}/repos`;
const PACKAGE_DIR = `${TMP_DIR}/packages`;

const MINIMAL_POSTFIX = 'minimal';
const MINIMAL_LEGACY_POSTFIX = 'minimal.legacy';

const MINIFY_BUNDLE = args.minify;
// const TEST_THEME = 'dark-blue';
const TEST_THEME = '';
const USE_WEBPACK = !(args.bundler === 'esbuild');

let testsPattern = args.tests;
if (testsPattern) {
  testsPattern = testsPattern.split(',');
}

// Create a server
const port = 3322;
const baseUrl = `http://localhost:${port}`;

const TEMPLATE_CODE = `
// @ts-ignore
echarts.registerPreprocessor(function (option) {
    option.animation = false;
    if (option.series) {
        if (!(option.series instanceof Array)) {
            option.series = [option.series];
        }
        // @ts-ignore
        option.series.forEach(function (seriesOpt) {
            if (seriesOpt.type === 'graph') {
                seriesOpt.force = seriesOpt.force || {};
                seriesOpt.force.layoutAnimation = false;
            }
            seriesOpt.progressive = 1e5;
            seriesOpt.animation = false;
        });
    }
});
`;

function buildPrepareCode(isESM, lang) {
  return `
// @ts-ignore
${
  isESM
    ? `import _seedrandom from 'seedrandom';`
    : `const _seedrandom = require('seedrandom');`
}

// Check if i18n will break the minimal imports.
${
  lang
    ? isESM
      ? `import 'echarts/i18n/${lang}';`
      : `require('echarts/i18n/${lang}');`
    : ''
}
// @ts-ignore
const _myrng = _seedrandom('echarts');
// @ts-ignore
Math.random = function () {
    // @ts-ignore
    return _myrng();
};
${TEMPLATE_CODE}
`;
}

async function prepare() {
  fse.removeSync(TMP_DIR);
  fse.removeSync(RUN_CODE_DIR);
  fse.removeSync(BUNDLE_DIR);
  fse.removeSync(SCREENSHOTS_DIR);

  fse.removeSync(REPO_DIR);
  fse.removeSync(PACKAGE_DIR);

  fse.removeSync(nodePath.join(__dirname, 'package.json'));
  fse.removeSync(nodePath.join(__dirname, 'package-lock.json'));
  fse.copySync(nodePath.join(__dirname, 'package.tpl.json'), nodePath.join(__dirname, 'package.json'));

  fse.ensureDirSync(TMP_DIR);
  fse.ensureDirSync(RUN_CODE_DIR);
  fse.ensureDirSync(BUNDLE_DIR);
  fse.ensureDirSync(SCREENSHOTS_DIR);

  fse.ensureDirSync(REPO_DIR);
  fse.ensureDirSync(PACKAGE_DIR);
}

async function downloadPackages(config) {
  for (let pkg of config.packages) {
    const pkgDownloadPath = nodePath.join(REPO_DIR, pkg.name);
    console.log(chalk.gray(`Downloading ${pkg.git}`));
    await promisify(downloadGit)(pkg.git, pkgDownloadPath);
    // Override the path
    pkg.dir = pkgDownloadPath;
  }
}

async function installPackages(config) {
  const publishedPackages = {};

  function checkFolder(pkg) {
    const dir = pkg.dir;
    if (!fs.existsSync(dir)) {
      console.warn(
        chalk.yellow(`${dir} not exists. Please update it in e2e/config.js.`)
      );
      return false;
    }
    if (!nodePath.isAbsolute(dir)) {
      console.warn(
        chalk.yellow(
          `${dir} is not an absolute path. Please update it in e2e/config.js.`
        )
      );
      return false;
    }
    return true;
  }

  function publishPackage(pkg) {
    console.log(chalk.gray(`Publishing ${pkg.dir}`));

    shell.cd(pkg.dir);

    const packageJsonPath = nodePath.join(pkg.dir, 'package.json');
    const packageJsonRaw = fs.readFileSync(packageJsonPath, {encoding: 'utf-8'});
    const packageJson = JSON.parse(packageJsonRaw);
    const tgzFileName = `${packageJson.name}-${packageJson.version}.tgz`;
    const targetTgzFilePath = nodePath.join(PACKAGE_DIR, tgzFileName);
    let needModifyPackageJSON = false;

    function doesConfigIncludesDepPkg(depPkgName) {
      return !!config.packages.find((a) => a.name === depPkgName)
    }

    if (packageJson.dependencies) {
      for (let depPkgName in packageJson.dependencies) {
        if (!doesConfigIncludesDepPkg(depPkgName) || publishedPackages[depPkgName]) {
          continue;
        }
        publishPackage(depPkg);
        // Come back.
        shell.cd(pkg.dir);
      }

      if (shell.exec(`npm install`).code !== 0) {
        console.error(`shell fail: npm install in ${pkg.dir}`);
        process.exit(1);
      }

      for (let depPkgName in packageJson.dependencies) {
        if (!doesConfigIncludesDepPkg(depPkgName)) {
          continue;
        }
        console.log(
          chalk.gray(
            `Installing dependency ${depPkgName} from "${publishedPackages[depPkgName].targetTgzFilePath}" ...`
          )
        );
        if (shell.exec(`npm install ${publishedPackages[depPkgName].targetTgzFilePath}`).code !== 0) {
          console.error(`shell fail: npm install ${publishedPackages[depPkgName].targetTgzFilePath}`);
          process.exit(1);
        }
        // After the npm install above, the package.json will be modified to like:
        // "dependencies": ["zredner": "file:../echarts-examples/e2e/tmp/packages/zrender-5.3.2.tgz"]
        // which is a relative path and not correct if the tgz is copied to another place in
        // the latter process.
        // If we use --no-save, the latter npm install by tgz may not use the version of zrender that
        // config.js specified.
        // So we modify the version mandatorily to the version that config.js specified.
        // In the latter npm install by tgz, the zrender will be installed firstly. And when echarts
        // is installing, it found the right version of zrender has been installed, and do not install
        // zrender separately.
        needModifyPackageJSON = true;
        packageJson.dependencies[depPkgName] = publishedPackages[depPkgName].version;
        console.log(chalk.gray(`Install dependency ${depPkgName} done.`));
      }
    }

    if (needModifyPackageJSON) {
      // Modify package.json for npm pack.
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson), {encoding: 'utf-8'});
    }
    if (shell.exec(`npm pack`).code !== 0) {
      console.error(`shell fail: npm pack in ${pkg.dir}`);
      shell.exit(1);
    }
    fs.renameSync(nodePath.join(pkg.dir, tgzFileName), targetTgzFilePath);
    publishedPackages[packageJson.name] = {targetTgzFilePath, version: packageJson.version};

    if (needModifyPackageJSON) {
      // Restore modified package.json
      fs.writeFileSync(packageJsonPath, packageJsonRaw, {encoding: 'utf-8'});
    }
  }

  for (let pkg of config.packages) {
    if (!checkFolder(pkg)) {
      process.exit(1);
    }
    publishPackage(pkg);
  }

  shell.cd(__dirname);
  for (let pkg of config.packages) {
    console.log(
      chalk.gray(
        `Installing ${pkg.name} from "${publishedPackages[pkg.name].targetTgzFilePath}" ...`
      )
    );
    if (shell.exec(`npm install ${publishedPackages[pkg.name].targetTgzFilePath}`).code !== 0) {
      console.log(`shell fail: npm install ${publishedPackages[pkg.name].targetTgzFilePath}`);
      process.exit(1);
    }
    console.log(chalk.gray(`Install ${pkg.name} done.`));
  }

  // Come back.
  shell.cd(process.cwd());
}

async function buildRunCode() {
  const files = await globby([
    `${PUBLIC_DIR}/data/option/*.json`,
    `${PUBLIC_DIR}/data-gl/option/*.json`
  ]);

  if (!files.length) {
    throw new Error(
      'You need to run `node tool/build-example.js` before run this test.'
    );
  }

  async function addTestCase(
    testName,
    testCode,
    deps,
    checkTs,
    extraImports,
    extraRequire
  ) {
    const ROOT_PATH = `${baseUrl}/public`;

    const fullCode = buildExampleCode(buildPrepareCode(true) + testCode, deps, {
      minimal: false,
      ts: checkTs,
      // Check if theme will break the minimal imports.
      theme: TEST_THEME,
      ROOT_PATH,
      extraImports
    });
    const minimalCode = buildExampleCode(
      buildPrepareCode(true) + testCode,
      deps,
      {
        minimal: true,
        ts: checkTs,
        theme: TEST_THEME,
        ROOT_PATH,
        extraImports
      }
    );
    const legacyCode = buildExampleCode(
      buildPrepareCode(false) + testCode,
      deps,
      {
        minimal: true,
        esm: false,
        ts: false,
        theme: TEST_THEME,
        ROOT_PATH,
        extraImports: extraRequire
      }
    );

    await fse.writeFile(
      nodePath.join(RUN_CODE_DIR, testName + (checkTs ? '.ts' : '.js')),
      prettier.format(fullCode, {
        singleQuote: true,
        parser: checkTs ? 'typescript' : 'babel'
      }),
      'utf-8'
    );
    await fse.writeFile(
      nodePath.join(
        RUN_CODE_DIR,
        testName + `.${MINIMAL_POSTFIX}.${checkTs ? 'ts' : 'js'}`
      ),
      prettier.format(minimalCode, {
        singleQuote: true,
        parser: checkTs ? 'typescript' : 'babel'
      }),
      'utf-8'
    );
    await fse.writeFile(
      nodePath.join(RUN_CODE_DIR, testName + `.${MINIMAL_LEGACY_POSTFIX}.js`),
      prettier.format(legacyCode, {
        singleQuote: true,
        parser: 'babel'
      }),
      'utf-8'
    );
    console.log(chalk.green('Generated: ', testName));
  }

  const builtinTestCases = await runTasks(
    files,
    async (fileName) => {
      const isGL = fileName.startsWith(`${PUBLIC_DIR}/data-gl`);
      const testName = nodePath.basename(fileName, '.json');

      if (
        testsPattern &&
        !testsPattern.some((pattern) => minimatch(testName, pattern))
      ) {
        return;
      }

      const optionCode = await fse.readFile(fileName, 'utf-8');
      let option;
      try {
        option = JSON.parse(optionCode);
      } catch (err) {
        console.error(
          `Parse JSON error: fileName: ${fileName} | fileContent: ${optionCode}`
        );
        throw err;
      }
      const testCode = await fse.readFile(
        nodePath.join(EXAMPLE_DIR, 'js', isGL ? 'gl' : '', testName + '.js'),
        'utf-8'
      );

      // TODO Ignore case with extension.

      const deps = collectDeps(option).concat([
        // TODO SVG
        'CanvasRenderer'
      ]);

      if (
        !(testName === 'map-HK' || testName === 'map-usa') && // Only test these two map examples
        (deps.includes('MapChart') ||
          deps.includes('GeoComponent') ||
          option.bmap)
      ) {
        console.warn(chalk.yellow(`Ignored map tests ${testName}`));
        return;
      }

      // Do typescript check in compile:example
      await addTestCase(testName, testCode, deps, false);

      return testName;
    },
    20
  );
  const extensionTestCases = await runTasks(
    await globby(__dirname + '/cases/*.js'),
    async (fileName) => {
      const testName = nodePath.basename(fileName, '.js');
      if (
        testsPattern &&
        !testsPattern.some((pattern) => minimatch(testName, pattern))
      ) {
        return;
      }

      const testCode = await fse.readFile(fileName, 'utf-8');
      let importsCode = '';
      let requireCode = '';
      try {
        const fmResult = matter(testCode, {
          delimiters: ['/*', '*/']
        });
        const extension = fmResult.data.extension;
        if (extension) {
          importsCode = `import '${extension}';`;
          requireCode = `require('${extension}');`;
        }
      } catch (e) {}
      await addTestCase(
        testName,
        testCode,
        [],
        false,
        importsCode,
        requireCode
      );

      return testName;
    },
    20
  );

  return builtinTestCases.concat(extensionTestCases).filter((a) => !!a);
}

async function compileTs(tsTestFiles, result) {
  const config = JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, 'tsconfig.json'), 'utf-8')
  );

  const compilerOptions = {
    ...config.compilerOptions
  };

  const { options, errors } = ts.convertCompilerOptionsFromJson(
    compilerOptions,
    nodePath.resolve(__dirname)
  );

  if (errors.length) {
    let errMsg =
      'tsconfig parse failed: ' +
      errors.map((error) => error.messageText).join('. ') +
      '\n compilerOptions: \n' +
      JSON.stringify(config.compilerOptions, null, 4);
    assert(false, errMsg);
  }

  // Generate this config file for checking the source code in vscode.
  fs.writeFileSync(
    nodePath.join(RUN_CODE_DIR, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions
      },
      null,
      2
    ),
    'utf-8'
  );

  // See: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
  let program = ts.createProgram(tsTestFiles, options);
  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );

      const compilerError = {
        location: [line + 1, character + 1],
        message
      };
      if (diagnostic.file.fileName.endsWith(`${MINIMAL_POSTFIX}.ts`)) {
        const basename = nodePath.basename(
          diagnostic.file.fileName,
          `.${MINIMAL_POSTFIX}.ts`
        );
        if (!result[basename]) {
          throw new Error(`${basename} does not exists in result.`);
        }
        result[basename].compileErrors.minimal.push(compilerError);
      } else {
        const basename = nodePath.basename(diagnostic.file.fileName, `.ts`);
        if (!result[basename]) {
          throw new Error(`${basename} does not exists in result.`);
        }
        result[basename].compileErrors.full.push(compilerError);
      }
      // console.log(chalk.red(`${diagnostic.file.fileName} (${line + 1},${character + 1})`));
      // console.log(chalk.gray(message));
    } else {
      console.log(
        chalk.red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
      );
    }
  });
  // assert(!emitResult.emitSkipped, 'ts compile failed.');
}

async function webpackBundle(esbuildService, entry, result) {
  return new Promise((resolve) => {
    webpack(
      {
        entry,
        output: {
          path: BUNDLE_DIR,
          filename: '[name].js'
        },
        // Use esbuild as minify, terser is tooooooo slow for so much tests.
        optimization: {
          minimizer: MINIFY_BUNDLE
            ? [
                {
                  apply(compiler) {
                    compiler.hooks.compilation.tap(
                      'ESBuild Minify',
                      (compilation) => {
                        compilation.hooks.optimizeChunkAssets.tapPromise(
                          'ESBuild Minify',
                          async (chunks) => {
                            for (const chunk of chunks) {
                              for (const file of chunk.files) {
                                const asset = compilation.assets[file];
                                const { source } = asset.sourceAndMap();
                                const result = await esbuildService.transform(
                                  source,
                                  {
                                    minify: true,
                                    sourcemap: false
                                  }
                                );
                                compilation.updateAsset(file, () => {
                                  return new RawSource(result.code || '');
                                });
                              }
                            }
                          }
                        );
                      }
                    );
                  }
                }
              ]
            : []
        }
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          if (err) {
            console.error(err.stack || err);
            if (err.details) {
              console.error(err.details);
            }
            resolve();
            return;
          }

          const info = stats.toJson();

          if (stats.hasErrors()) {
            console.error(info.errors);
          }

          if (stats.hasWarnings()) {
            console.warn(info.warnings);
          }
        } else {
          console.log(
            chalk.green(
              `${Object.values(entry)
                .map((a) => `Bundled ${a}`)
                .join('\n')}`
            )
          );
        }

        resolve();
      }
    );
  });
}

function esbuildBundle(entry, result, minify) {
  return esbuild.build({
    entryPoints: entry,
    bundle: true,
    minify: minify,
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        minify ? 'production' : 'development'
      )
    },
    outdir: BUNDLE_DIR
  });
}

async function bundle(entryFiles, result) {
  if (USE_WEBPACK) {
    // Split to multiple buckets to seepup bundle
    // TODO Multiple entry may have effects on the final bundle.
    const BUCKET_SIZE = 1;
    const buckets = [];
    const esbuildService = await esbuild.startService();
    let count = 0;
    outer: while (true) {
      const bucket = {};
      for (let i = 0; i < BUCKET_SIZE; i++) {
        const filePath = entryFiles[count++];
        if (!filePath) {
          break outer;
        }
        const basename = nodePath.basename(filePath, '.js');
        bucket[basename] = filePath;
      }
      buckets.push(bucket);
    }

    // TODO Multiple thread.
    for (let bucket of buckets) {
      await webpackBundle(esbuildService, bucket, result);
    }

    esbuildService.stop();
  } else {
    for (let file of entryFiles) {
      await esbuildBundle([file], result, MINIFY_BUNDLE);
      console.log(chalk.green(`Bundled ${file}`));
    }
  }
}

function waitTime(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function runExamples(jsFiles, result) {
  const fileServer = new nStatic.Server(__dirname + '/../');
  const server = require('http').createServer(function (request, response) {
    request
      .addListener('end', function () {
        fileServer.serve(request, response);
      })
      .resume();
  });
  server.listen(port);

  try {
    const IGNORE_LOG = [
      'A cookie associated with a cross-site resource at',
      'A parser-blocking, cross site',
      // For ECharts GL
      'RENDER WARNING',
      'GL ERROR',
      'GL_INVALID_OPERATION'
    ];

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

    await runTasks(
      jsFiles,
      async (file) => {
        const page = await browser.newPage();
        const basename = nodePath.basename(file, '.js');
        await page.setViewport({ width: 800, height: 600 });

        page.on('pageerror', function (err) {
          // TODO Record pageerror
          console.error(chalk.red(`[PAGE ERROR] [${basename}]`));
          console.error(chalk.red(err.toString()));
        });
        page.on('console', (msg) => {
          const text = msg.text();
          if (!IGNORE_LOG.find((a) => text.indexOf(a) >= 0)) {
            console.log(chalk.gray(`[PAGE LOG] [${basename}]: ${text}`));
          }
        });

        await page.goto(`${baseUrl}/e2e/template.html`, {
          waitUntil: 'networkidle0',
          timeout: 10000
        });
        await page.addScriptTag({
          url: `${baseUrl}/e2e/tmp/bundles/${basename}.js`
        });
        await waitTime(200);

        await page.screenshot({
          type: 'png',
          path: nodePath.resolve(SCREENSHOTS_DIR, basename + '.png')
        });

        await page.close();

        console.log(chalk.green(`Rendered ${file}`));
      },
      8
    );
  } catch (e) {
    server.close();
    throw e;
  }
}

async function compareExamples(testNames, result) {
  function writePNG(png, diffPath) {
    return new Promise((resolve) => {
      const writer = fs.createWriteStream(diffPath);
      png.pack().pipe(writer);
      writer.on('finish', () => {
        resolve();
      });
    });
  }

  for (let testName of testNames) {
    const diffMinimal = await compareImage(
      nodePath.resolve(SCREENSHOTS_DIR, testName + '.png'),
      nodePath.resolve(SCREENSHOTS_DIR, `${testName}.${MINIMAL_POSTFIX}.png`)
    );
    const diffMinimalLegacy = await compareImage(
      nodePath.resolve(SCREENSHOTS_DIR, testName + '.png'),
      nodePath.resolve(
        SCREENSHOTS_DIR,
        `${testName}.${MINIMAL_LEGACY_POSTFIX}.png`
      )
    );

    const diffMinimalPNGPath = nodePath.resolve(
      SCREENSHOTS_DIR,
      `${testName}.${MINIMAL_POSTFIX}.diff.png`
    );
    const diffMinimalLegacyPNGPath = nodePath.resolve(
      SCREENSHOTS_DIR,
      `${testName}.${MINIMAL_LEGACY_POSTFIX}.diff.png`
    );

    if (!diffMinimal.diffPNG) {
      console.error(`Screenshot Error in ${testName}`);
    } else {
      writePNG(diffMinimal.diffPNG, diffMinimalPNGPath);
    }
    if (!diffMinimalLegacy.diffPNG) {
      console.error(`Screenshot Error in ${testName}, minimal`);
    } else {
      writePNG(diffMinimalLegacy.diffPNG, diffMinimalLegacyPNGPath);
    }

    result[testName].screenshotDiff = {
      minimal: {
        ratio: diffMinimal.diffRatio,
        png: nodePath.basename(diffMinimalPNGPath)
      },
      minimalLegacy: {
        ratio: diffMinimalLegacy.diffRatio,
        png: nodePath.basename(diffMinimalLegacyPNGPath)
      }
    };

    if (diffMinimal.diffRatio > 0 || diffMinimalLegacy.diffRatio > 0) {
      console.log(chalk.red(`Failed ${testName}`));
    } else {
      console.log(chalk.green(`Passed ${testName}`));
    }
  }
}

async function main() {
  let result;

  if (!args.skip && !args.tests) {
    // Don't clean up if skipping some of the stages.
    await prepare();
    result = {};
  } else {
    // Read result.
    try {
      result = JSON.parse(
        fs.readFileSync(__dirname + '/tmp/result.json', 'utf-8')
      );
    } catch (e) {
      console.log(`Can not find ${__dirname}/tmp/result.json. Make a new one.`);
      result = {};
    }
  }

  function isNotSkipped(stage) {
    return !((args.skip || '').indexOf(stage) >= 0);
  }

  // We don't have to test the npm if bundle is also skipped.
  if (isNotSkipped('npm') && isNotSkipped('bundle')) {
    if (!args.local) {
      console.log(chalk.gray('Downloading packages'));
      await downloadPackages(config);
    }

    console.log(chalk.gray('Installing packages'));
    await installPackages(config);
  } else {
    console.log(chalk.yellow('Skipped NPM.'));
  }

  console.log(chalk.gray('Generating codes'));
  // Always build code.
  const testNames = await buildRunCode();

  for (let key of testNames) {
    result[key] = result[key] || {};
  }

  Object.keys(result).forEach((key) => {
    // Always do TS check on all tests. So reset all compile errors.
    result[key].compileErrors = {
      full: [],
      minimal: [],
      minimalLegacy: []
    };
  });

  console.log('Compiling TypeScript');
  // Always run typescript check to generate the js code.
  await compileTs(
    (
      await globby(nodePath.join(RUN_CODE_DIR, '*.ts'))
    )
      // No need to check types of the minimal legacy imports
      .filter((a) => !a.endsWith(`${MINIMAL_LEGACY_POSTFIX}.ts`)),
    result
  );

  if (isNotSkipped('bundle')) {
    console.log(
      chalk.green(`Bundling with ${USE_WEBPACK ? 'webpack' : 'esbuild'}`)
    );
    const jsFiles = [];
    for (let testName of testNames) {
      jsFiles.push(
        nodePath.join(RUN_CODE_DIR, `${testName}.js`),
        nodePath.join(RUN_CODE_DIR, `${testName}.${MINIMAL_POSTFIX}.js`),
        nodePath.join(RUN_CODE_DIR, `${testName}.${MINIMAL_LEGACY_POSTFIX}.js`)
      );
    }
    await bundle(jsFiles, result);
  } else {
    console.log(chalk.yellow('Skipped Bundle.'));
  }

  if (isNotSkipped('render')) {
    console.log(chalk.green('Running examples'));
    const bundleFiles = [];
    for (let testName of testNames) {
      bundleFiles.push(
        nodePath.join(BUNDLE_DIR, `${testName}.js`),
        nodePath.join(BUNDLE_DIR, `${testName}.${MINIMAL_POSTFIX}.js`),
        nodePath.join(BUNDLE_DIR, `${testName}.${MINIMAL_LEGACY_POSTFIX}.js`)
      );
    }
    await runExamples(bundleFiles, result);
  } else {
    console.log(chalk.yellow('Skipped Render.'));
  }

  if (isNotSkipped('compare')) {
    console.log(chalk.green('Comparing Results'));
    await compareExamples(testNames, result);
  } else {
    console.log(chalk.yellow('Skipped Compare.'));
  }

  fs.writeFileSync(
    __dirname + '/tmp/result.json',
    JSON.stringify(result, null, 2),
    'utf-8'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit();
  });

process.on('SIGINT', function () {
  console.log('Closing');
  // Close through ctrl + c;
  process.exit(1);
});
