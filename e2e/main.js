// TODO Specify echarts path

const fs = require('fs');
const globby = require('globby');
const {buildExampleCode, collectDeps} = require('../common/buildCode');
const nodePath = require('path');
const { runTasks } = require('../common/task');
const fse = require('fs-extra');
const prettier = require('prettier');
const ts = require('typescript');
const chalk = require('chalk');
const nStatic = require('node-static');
const webpack = require('webpack');
const {RawSource} = require('webpack-sources');
const argparse = require('argparse');
const esbuild = require('esbuild');
const puppeteer = require('puppeteer');
const config = require('./config');
const {compareImage} = require('../common/compareImage');
const shell = require('shelljs');
const downloadGit = require('download-git-repo');
const {promisify} = require('util');

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
parser.addArgument(['--fetch'], {
    action: 'storeTrue',
    help: `If fetch repo from github. If not use fetch, don't forget to update the location of local repo in config.js.`
})
const args = parser.parseArgs();

const EXAMPLE_DIR =  `${__dirname}/../public/`;
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
`

function buildPrepareCode(isESM, lang) {
    return `
// @ts-ignore
${isESM
    ? `import _seedrandom from 'seedrandom';`
    : `const _seedrandom = require('seedrandom');`
}

// Check if i18n will break the minimal imports.
${lang
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
        console.log(chalk.gray(`Downloading ${pkg.git}`))
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
            console.warn(chalk.yellow(`${dir} not exists. Please update it in e2e/config.js. Or use --fetch to fetch from GitHub.`));
            return false;
        }
        if (!nodePath.isAbsolute(dir)) {
            console.warn(chalk.yellow(`${dir} is not an absolute path. Please update it in e2e/config.js. Or add --fetch flag to fetch from GitHub.`));
            return false;
        }
        return true;
    }

    function publishPackage(pkg) {
        console.log(chalk.gray(`Publishing ${pkg.dir}`))

        shell.cd(pkg.dir);

        const packageJson = JSON.parse(fs.readFileSync(nodePath.join(pkg.dir, 'package.json')));
        const tgzFileName = `${packageJson.name}-${packageJson.version}.tgz`;
        const targetTgzFilePath = nodePath.join(PACKAGE_DIR, tgzFileName);

        if (packageJson.dependencies) {
            for (let depPkgName in packageJson.dependencies) {
                if (!publishedPackages[depPkgName]) {
                    const depPkg = config.packages.find(a => a.name === depPkgName);
                    if (depPkg) {
                        publishPackage(depPkg);
                        // Come back.
                        shell.cd(pkg.dir);
                    }
                }

                shell.exec(`npm install`)
                shell.exec(`npm install ${publishedPackages[depPkgName]} --no-save`);
            }
        }

        shell.exec(`npm pack`);
        fs.renameSync(nodePath.join(pkg.dir, tgzFileName), targetTgzFilePath);
        publishedPackages[packageJson.name] = targetTgzFilePath;
    }

    for (let pkg of config.packages) {
        if (!checkFolder(pkg)) {
            return;
        }

        publishPackage(pkg);
    };

    // Come back.
    shell.cd(__dirname);
    for (let pkg of config.packages) {
        console.log(chalk.gray(`Installing ${pkg.name}`))
        shell.exec(`npm install ${publishedPackages[pkg.name]}`);
    }
}

async function buildRunCode() {
    const files = await globby(`${EXAMPLE_DIR}/data/option/*.json`);

    if (!files.length) {
        throw new Error('You need to run `node tool/build-example.js` before run this test.');
    }

    return (await runTasks(files, async (fileName) => {
        const optionCode = await fse.readFile(fileName, 'utf-8');
        const option = JSON.parse(optionCode);
        const jsCode = await fse.readFile(nodePath.join(
            EXAMPLE_DIR, 'data', nodePath.basename(fileName, '.json') + '.js'
        ), 'utf-8');

        // TODO Ignore case with extension.

        const deps = collectDeps(option).concat([
            // TODO SVG
            'CanvasRenderer'
        ]);

        if (deps.includes('MapChart') || deps.includes('GeoComponent') || option.bmap) {
            console.warn(chalk.yellow(`Ignored map tests.${fileName}`));
            return;
        }

        const testName = nodePath.basename(fileName, '.json');
        const ROOT_PATH = `${baseUrl}/public`;

        const fullTsCode = buildExampleCode(buildPrepareCode(true) + jsCode, deps, {
            minimal: false,
            ts: true,
            // Check if theme will break the minimal imports.
            theme: TEST_THEME,
            ROOT_PATH
        });
        const minimalTsCode = buildExampleCode(buildPrepareCode(true) + jsCode, deps, {
            minimal: true,
            ts: true,
            theme: TEST_THEME,
            ROOT_PATH
        });
        const legacyCode = buildExampleCode(buildPrepareCode(false) + jsCode, deps, {
            minimal: true,
            esm: false,
            ts: false,
            theme: TEST_THEME,
            ROOT_PATH
        });

        await fse.writeFile(
            nodePath.join(RUN_CODE_DIR, testName + '.ts'),
            prettier.format(fullTsCode, {
                singleQuote: true,
                parser: 'typescript'
            }), 'utf-8'
        );
        await fse.writeFile(
            nodePath.join(RUN_CODE_DIR, testName + `.${MINIMAL_POSTFIX}.ts`),
            prettier.format(minimalTsCode, {
                singleQuote: true,
                parser: 'typescript'
            }), 'utf-8'
        );
        await fse.writeFile(
            nodePath.join(RUN_CODE_DIR, testName + `.${MINIMAL_LEGACY_POSTFIX}.js`),
            prettier.format(legacyCode, {
                singleQuote: true,
                parser: 'babel'
            }), 'utf-8'
        );
        console.log(
            chalk.green('Generated: ', nodePath.join(RUN_CODE_DIR, testName + '.ts'))
        );

        return testName;
    }, 20))
        .filter(a => !!a);
}

async function compileTs(tsTestFiles, result) {
    const config = JSON.parse(fs.readFileSync(nodePath.join(__dirname, 'tsconfig.json'), 'utf-8'));

    const compilerOptions = {
        ...config.compilerOptions
    };

    const {options, errors} = ts.convertCompilerOptionsFromJson(compilerOptions, nodePath.resolve(__dirname));

    if (errors.length) {
        let errMsg = 'tsconfig parse failed: '
            + errors.map(error => error.messageText).join('. ')
            + '\n compilerOptions: \n' + JSON.stringify(config.compilerOptions, null, 4);
        assert(false, errMsg);
    }

    // Generate this config file for checking the source code in vscode.
    fs.writeFileSync(nodePath.join(RUN_CODE_DIR, 'tsconfig.json'), JSON.stringify({
        compilerOptions
    }, null, 2), 'utf-8');

    // See: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
    let program = ts.createProgram(tsTestFiles, options);
    let emitResult = program.emit();

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

            const compilerError = {
                location: [line + 1, character + 1],
                message
            };
            if (diagnostic.file.fileName.endsWith(`${MINIMAL_POSTFIX}.ts`)) {
                const basename = nodePath.basename(diagnostic.file.fileName, `.${MINIMAL_POSTFIX}.ts`);
                result[basename].compileErrors.minimal.push(compilerError);
            }
            else {
                const basename = nodePath.basename(diagnostic.file.fileName,  `.ts`);
                result[basename].compileErrors.full.push(compilerError);
            }
            // console.log(chalk.red(`${diagnostic.file.fileName} (${line + 1},${character + 1})`));
            // console.log(chalk.gray(message));
        }
        else {
            console.log(chalk.red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
        }
    });
    // assert(!emitResult.emitSkipped, 'ts compile failed.');
}

async function webpackBundle(esbuildService, entry, result) {
    return new Promise((resolve) => {
        webpack({
            entry,
            output: {
                path: BUNDLE_DIR,
                filename: '[name].js'
            },
            // Use esbuild as minify, terser is tooooooo slow for so much tests.
            optimization: {
                minimizer: MINIFY_BUNDLE ? [{
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
                                                const result = await esbuildService.transform(source, {
                                                    minify: true,
                                                    sourcemap: false
                                                });
                                                compilation.updateAsset(file, () => {
                                                    return new RawSource(result.code || '');
                                                });
                                            }
                                        }
                                    }
                                );
                            },
                          );

                    }
                }] : []
            }
        }, (err, stats) => {
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
            }
            else {
                console.log(chalk.green(`${Object.values(entry).map(a => `Bundled ${a}`).join('\n')}`));
            }

            resolve();
        });
    })
}

function esbuildBundle(entry, result, minify) {
    return esbuild.build({
        entryPoints: entry,
        bundle: true,
        minify: minify,
        plugins: [echartsResolvePlugin, zrenderResolverPlugin],
        define: {
            'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development')
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
    }
    else {
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
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    })
    server.listen(port);

    try {
        const IGNORE_LOG = [
            'A cookie associated with a cross-site resource at',
            'A parser-blocking, cross site'
        ];

        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--headless',
                '--hide-scrollbars',
                '--mute-audio'
            ]
        });

        await runTasks(jsFiles, async (file) => {
            const page = await browser.newPage();
            const basename = nodePath.basename(file, '.js');
            await page.setViewport({ width: 800, height: 600 });

            page.on('pageerror', function (err) {
                // TODO Record pageerror
                console.error(chalk.red(`[PAGE ERROR] [${basename}]`));
                console.error(chalk.red(err.toString()));
            });
            page.on('console', msg => {
                const text = msg.text();
                if (!IGNORE_LOG.find(a => text.indexOf(a) >= 0)) {
                    console.log(chalk.gray(`[PAGE LOG] [${basename}]: ${text}`));
                }
            });

            await page.goto(`${baseUrl}/test/template.html`, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
            await page.addScriptTag({
                url: `${baseUrl}/test/tmp/bundles/${basename}.js`
            });
            await waitTime(200);

            await page.screenshot({
                type: 'png',
                path: nodePath.resolve(SCREENSHOTS_DIR, basename + '.png')
            });

            await page.close();

            console.log(chalk.green(`Rendered ${file}`));
        }, 8);
    }
    catch (e) {
        server.close();
        throw e;
    }
}


async function compareExamples(testNames, result) {

    function writePNG(png, diffPath) {
        return new Promise(resolve => {
            const writer = fs.createWriteStream(diffPath);
            png.pack().pipe(writer);
            writer.on('finish', () => { resolve(); });
        });
    }

    for (let testName of testNames) {
        const diffMinimal = await compareImage(
            nodePath.resolve(SCREENSHOTS_DIR, testName + '.png'),
            nodePath.resolve(SCREENSHOTS_DIR, `${testName}.${MINIMAL_POSTFIX}.png`)
        );
        const diffMinimalLegacy = await compareImage(
            nodePath.resolve(SCREENSHOTS_DIR, testName + '.png'),
            nodePath.resolve(SCREENSHOTS_DIR, `${testName}.${MINIMAL_LEGACY_POSTFIX}.png`)
        );

        const diffMinimalPNGPath = nodePath.resolve(SCREENSHOTS_DIR, `${testName}.${MINIMAL_POSTFIX}.diff.png`);
        const diffMinimalLegacyPNGPath = nodePath.resolve(SCREENSHOTS_DIR, `${testName}.${MINIMAL_LEGACY_POSTFIX}.diff.png`);

        writePNG(diffMinimal.diffPNG, diffMinimalPNGPath);
        writePNG(diffMinimalLegacy.diffPNG, diffMinimalLegacyPNGPath);

        result[testName].screenshotDiff.minimal = {
            ratio: diffMinimal.diffRatio,
            png: nodePath.basename(diffMinimalPNGPath)
        };
        result[testName].screenshotDiff.minimalLegacy = {
            ratio: diffMinimalLegacy.diffRatio,
            png: nodePath.basename(diffMinimalLegacyPNGPath)
        };

        if (diffMinimal.diffRatio > 0 || diffMinimalLegacy.diffRatio > 0) {
            console.log(chalk.red(`Failed ${testName}`));
        }
        else {
            console.log(chalk.green(`Passed ${testName}`));
        }
    }
}


async function main() {
    const result = {};
    await prepare();

    if (args.fetch) {
        console.log(chalk.gray('Downloading packages'));
        await downloadPackages(config);
    }

    console.log(chalk.gray('Installing packages'));
    await installPackages(config);


    console.log(chalk.gray('Generating codes'));
    const testNames = await buildRunCode();


    for (let key of testNames) {
        result[key] = {
            compileErrors: {
                full: [],
                minimal: [],
                minimalLegacy: [],
            },
            screenshotDiff: {}
        };
    }

    console.log('Compiling TypeScript');
    await compileTs(
        (await globby(nodePath.join(RUN_CODE_DIR, '*.ts')))
            // No need to check types of the minimal legacy imports
            .filter(a => !a.endsWith(`${MINIMAL_LEGACY_POSTFIX}.ts`)),
        result
    );

    console.log(`Bundling with ${USE_WEBPACK ? 'webpack' : 'esbuild'}`);
    await bundle(await globby(nodePath.join(RUN_CODE_DIR, '*.js')), result);

    console.log('Running examples');
    await runExamples(await globby(nodePath.join(BUNDLE_DIR, '*.js')), result);

    console.log('Comparing Results');
    await compareExamples(testNames, result);

    fs.writeFileSync(__dirname + '/tmp/result.json', JSON.stringify(
        result, null, 2
    ), 'utf-8');
}

main().catch(e => {
    console.error(e);
    process.exit();
}).then(() => {
    process.exit();
});

process.on('SIGINT', function() {
    console.log('Closing');
    // Close through ctrl + c;
    process.exit();
});