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

const esbuild = require('esbuild');
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');

const EXAMPLE_DIR =  `${__dirname}/../public/`;
const TMP_DIR = `${__dirname}/tmp`;
const RUN_CODE_DIR = `${TMP_DIR}/tests`;
const BUNDLE_DIR = `${TMP_DIR}/bundles`;
const SCREENSHOTS_DIR = `${TMP_DIR}/screenshots`;

const MINIFY_BUNDLE = true;
// const TEST_THEME = 'dark-blue';
const TEST_THEME = '';
const USE_WEBPACK = true;

const TEMPLATE_CODE = `
echarts.registerPreprocessor(function (option) {
    option.animation = false;
    if (option.series) {
        if (!(option.series instanceof Array)) {
            option.series = [option.series];
        }
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

const _myrng = _seedrandom('echarts');
Math.random = function () {
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

    fse.ensureDirSync(TMP_DIR);
    fse.ensureDirSync(RUN_CODE_DIR);
    fse.ensureDirSync(BUNDLE_DIR);
    fse.ensureDirSync(SCREENSHOTS_DIR);
}

async function buildRunCode() {
    const files = await globby(`${EXAMPLE_DIR}/data/option/*.json`);

    await runTasks(files, async (fileName) => {
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

        if (deps.includes('MapChart') || deps.includes('GeoComponent')) {
            console.warn(chalk.yellow('Ignored map tests.'));
            return;
        }

        const testName = nodePath.basename(fileName, '.json');
        const ROOT_PATH = 'public';

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
            nodePath.join(RUN_CODE_DIR, testName + '.minimal.ts'),
            prettier.format(minimalTsCode, {
                singleQuote: true,
                parser: 'typescript'
            }), 'utf-8'
        );
        await fse.writeFile(
            nodePath.join(RUN_CODE_DIR, testName + '.minimal.legacy.js'),
            prettier.format(legacyCode, {
                singleQuote: true,
                parser: 'babel'
            }), 'utf-8'
        );
        console.log(
            chalk.green('Generated: ', nodePath.join(RUN_CODE_DIR, testName + '.ts'))
        );
    }, 20);
}

async function compileTs(tsTestFiles, result) {
    const config = JSON.parse(fs.readFileSync(nodePath.join(__dirname, 'tsconfig.json'), 'utf-8'));

    const {options, errors} = ts.convertCompilerOptionsFromJson({
        ...config.compilerOptions
    }, nodePath.resolve(__dirname));

    if (errors.length) {
        let errMsg = 'tsconfig parse failed: '
            + errors.map(error => error.messageText).join('. ')
            + '\n compilerOptions: \n' + JSON.stringify(config.compilerOptions, null, 4);
        assert(false, errMsg);
    }

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

            const basename = nodePath.basename(diagnostic.file.fileName, '.ts');
            // console.log(chalk.red(`${diagnostic.file.fileName} (${line + 1},${character + 1})`));
            // console.log(chalk.gray(message));

            if (!result[basename]) {
                console.log(diagnostic.file.fileName);
            }

            result[basename].compileErrors.push({
                location: [line + 1, character + 1],
                message
            });
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
                minimizer: [{
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
                }]
            },
            resolve: {
                alias: {
                    echarts: nodePath.join(__dirname, '../../echarts-next'),
                    zrender: nodePath.join(__dirname, '../../zrender-next')
                }
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
    const echartsResolvePlugin = {
        name: 'echarts-resolver',
        setup(build) {
            build.onResolve({ filter: /^(echarts\/|echarts$)/ }, args => {
                const path = args.path.replace(
                    /^echarts/, nodePath.join(__dirname, '../../echarts-next')
                );
                return {
                    path: args.path === 'echarts' ? (path + '/index.js') : (path + '.js')
                };
            });
        }
    }
    const zrenderResolverPlugin = {
        name: 'zrender-resolver',
        setup(build) {
            build.onResolve({ filter: /^zrender/ }, args => {
                const path = args.path.replace(
                    /^zrender/, nodePath.join(__dirname, '../../zrender-next')
                ) + '.js';
                return { path };
            });
        }
    }

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
        const BUCKET_SIZE = 50;
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
    // Create a server
    const port = 3322;
    const baseUrl = `http://localhost:${port}/test/`;
    const fileServer = new nStatic.Server(__dirname + '/../');
    const server = require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    })
    server.listen(3322);

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
                console.error(chalk.red(`[PAGE ERROR] [${basename}]`));
                console.error(chalk.red(err.toString()));
            });
            page.on('console', msg => {
                const text = msg.text();
                if (!IGNORE_LOG.find(a => text.indexOf(a) >= 0)) {
                    console.log(chalk.gray(`[PAGE LOG] [${basename}]: ${text}`));
                }
            });

            await page.goto(`${baseUrl}/template.html`, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
            await page.addScriptTag({
                url: `${baseUrl}/tmp/bundles/${basename}.js`
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

async function main() {
    const result = {};

    await prepare();

    console.log(chalk.gray('Generating codes'));
    await buildRunCode();

    const tsFiles = await globby(nodePath.join(RUN_CODE_DIR, '*.ts'));

    for (let key of tsFiles) {
        const basename = nodePath.basename(key, '.ts');
        result[basename] = {
            compileErrors: []
        };
    }

    console.log('Compiling TypeScript');
    await compileTs(tsFiles, result);

    console.log('Bundling');
    await bundle(await globby(nodePath.join(RUN_CODE_DIR, '*.js')), result);

    console.log('Running examples');
    await runExamples(await globby(nodePath.join(BUNDLE_DIR, '*.js')), result);

    console.log('Comparing Results');

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