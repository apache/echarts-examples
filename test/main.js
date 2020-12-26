// TODO Specify echarts path

const fs = require('fs');
const globby = require('globby');
const {collectDeps, buildPartialImportCode, buildLegacyPartialImportCode} = require('../common/optionDeps');
const nodePath = require('path');
const { runTasks } = require('../common/task');
const fse = require('fs-extra');
const prettier = require('prettier');
const ts = require('typescript');
const chalk = require('chalk');
const nStatic = require('node-static');
const webpack = require('webpack');
const esbuild = require('esbuild');
const puppeteer = require('puppeteer');

const EXAMPLE_DIR =  `${__dirname}/../public/`;
const TMP_DIR = `${__dirname}/tmp`;
const RUN_CODE_DIR = `${TMP_DIR}/tests`;
const BUNDLE_DIR = `${TMP_DIR}/bundles`;
const SCREENSHOTS_DIR = `${TMP_DIR}/screenshots`;

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

    const testsList = await runTasks(files, async (fileName) => {
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

        const legacyCode = `
${buildLegacyPartialImportCode(deps, true)}
const ROOT_PATH = 'public';
const app = {};

const myChart = echarts.init(document.getElementById('main'));
var option;

${jsCode}

myChart.setOption(option);
`;
        // TODO: TS is mainly for type checking of option currently.
        const tsCode = `
${buildPartialImportCode(deps, true)}
const ROOT_PATH = 'public';
const app: any = {};

const myChart = echarts.init(document.getElementById('main'));
var option: ECOption;

${jsCode}

myChart.setOption(option);
`;
        const testName = nodePath.basename(fileName, '.json');
        const tsFile = nodePath.join(RUN_CODE_DIR, testName + '.ts');

        await fse.writeFile(
            tsFile,
            prettier.format(tsCode, {
                parser: 'typescript'
            }), 'utf-8'
        );
        await fse.writeFile(
            nodePath.join(RUN_CODE_DIR, testName + '.legacy.js'),
            prettier.format(legacyCode, {
                parser: 'babel'
            }), 'utf-8'
        );
        console.log(
            chalk.green('Generated: ', nodePath.join(RUN_CODE_DIR, testName + '.ts'))
        );
        return tsFile;
    }, 20);

    return testsList;
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

function webpackBundle(entry, result) {
    return new Promise((resolve) => {
        webpack({
            entry,
            output: {
                path: BUNDLE_DIR
                // filename: nodePath.basename(file)
            },
            resolve: {
                alias: {
                    echarts: nodePath.join(__dirname, '../../echarts-next')
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
                console.log(chalk.green(`Bundled ${entry.join(',\n')}`));
            }

            resolve();
        });
    })
}

function esbuildBundle(entry, result) {

    const echartsResolvePlugin = {
        name: 'echarts-resolver',
        setup(build) {
            build.onResolve({ filter: /^echarts/ }, args => {
                return {
                    path: args.path.replace(
                        /^echarts/, nodePath.join(__dirname, '../../echarts-next')
                    ) + '.js'
                };
            });
        }
    }

    return esbuild.build({
        entryPoints: entry,
        bundle: true,
        minify: true,
        plugins: [echartsResolvePlugin],
        define: {
            'process.env.NODE_ENV': JSON.stringify('production')
        },
        outdir: BUNDLE_DIR
    });
}

async function bundle(entryFiles, result) {
    // const entry = {};
    // for (let file of entryFiles) {
    //     entry[nodePath.basename(file, '.js')] = file;
    // }
    // await bundleSingle(entry, result);
    for (let file of entryFiles) {
        await esbuildBundle([file], result);
        console.log(chalk.green(`Bundled ${file}`));
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
        for (let file of jsFiles) {
            const page = await browser.newPage();
            const basename = nodePath.basename(file, '.js');
            await page.setViewport({ width: 800, height: 600 });

            page.on('pageerror', function (err) {
                console.error(chalk.red('[pageerror in]', basename));
                console.error(chalk.red(err.toString()));
            });
            page.on('console', msg => {
                const text = msg.text();
                if (!IGNORE_LOG.find(a => text.indexOf(a) >= 0)) {
                    console.log('PAGE LOG:', text);
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

            console.log(chalk.green(`Rendered ${file}`));
        }
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

    console.log(chalk.gray('Compiling TypeScript'));
    await compileTs(tsFiles, result);

    console.log(chalk.gray('Bundling'));
    await bundle(await globby(nodePath.join(RUN_CODE_DIR, '*.js')), result);

    console.log(chalk.gray('Running examples'));
    await runExamples(await globby(nodePath.join(BUNDLE_DIR, '*.js')), result);

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