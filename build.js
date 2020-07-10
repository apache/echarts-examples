const fs = require('fs');
const fse = require('fs-extra');
const sass = require('node-sass');
const globby = require('globby');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const jade = require('jade');
const path = require('path');
const uglify = require('uglify-js');
const assert = require('assert');

const argv = require('yargs').argv;
const projectDir = __dirname;

/**
 * ------------------------------------------------------------------------
 * Usage:
 *
 * ```shell
 * node build.js --env asf # build all for asf
 * node build.js --env echartsjs # build all for echartsjs.
 * node build.js --env localsite # build all for localsite.
 * node build.js --env dev # the same as "debug", dev the content of examples.
 * # Check `./config` to see the available env
 * ```
 * ------------------------------------------------------------------------
 */

function initEnv() {
    let envType = argv.env;
    let isDev = argv.dev != null || argv.debug != null || envType === 'debug' || envType === 'dev';

    if (isDev) {
        console.warn('====================================================================');
        console.warn('THIS IS IN DEV MODE');
        console.warn('!!! Please input your local host in `config/env.dev.js` firstly !!!');
        console.warn('====================================================================');
        envType = 'dev';
    }

    if (!envType) {
        throw new Error('--env MUST be specified');
    }

    let config = require('./config/env.' + envType);

    if (isDev) {
        console.warn('====================================================================');
        console.warn('Please visit the website: ');
        console.warn(config.host);
        console.warn('====================================================================');
    }

    assert(path.isAbsolute(config.releaseDestDir));

    config.envType = envType;

    return config;
}

async function copyResourcesToDest(config) {
    let basePath = path.resolve(projectDir, 'public');
    const filePaths = await globby([
        '**/*',
        '!stylesheets/scss/**/*'
    ], {
        cwd: basePath
    });

    console.log();

    for (let filePath of filePaths) {
        fse.ensureDirSync(
            path.resolve(config.releaseDestDir, path.dirname(filePath))
        );
        let destPath = path.resolve(config.releaseDestDir, filePath);
        fs.copyFileSync(
            path.resolve(basePath, filePath),
            destPath
        );

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(chalk.green(`resource copied to: ${destPath}`));
    }

    console.log('\ncopyResourcesToDest done.');
}

async function buildCSS(config) {
    let cssContent = await new Promise((resolve, reject) => {
        sass.render({
            file: path.resolve(projectDir, 'public/stylesheets/scss/main.scss'),
            includePaths: ['scss'],
            outputStyle: 'compressed'
        }, function (err, result) {
            if (err) {
                console.error(chalk.red(err));
                reject();
            }
            else {
                resolve(result.css);
            }
        });
    });

    const result = await postcss(
        autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})
    ).process(cssContent, {
        map: false,
        from: undefined
    });

    let destDir = path.resolve(config.releaseDestDir, 'stylesheets');
    fse.ensureDirSync(destDir);
    let destPath = path.resolve(destDir, 'main.css');
    fs.writeFileSync(destPath, result.css, 'utf8');
    console.log(chalk.green(`generated: ${destPath}`));

    console.log('buildCSS done.');
}

async function buildHTML(config) {
    let langs = ['zh', 'en'];

    const srcFilePathList = [
        ['views/view.jade', 'view.html'],
        ['views/editor.jade', 'editor.html'],
        ['views/index.jade', 'index.html'],
        ['views/404.jade', '404.html']
    ];
    for (let lang of langs) {
        for (let item of srcFilePathList) {
            doCompileAndWrite(item[0], `${lang}/${item[1]}`, lang);
        }
    }

    // Redirect old links like https://echarts.apache.com/examples/editor.html?c=pie-legend
    const srcOldFilePathList = [
        ['views/old-redirect/view.jade', 'view.html'],
        ['views/old-redirect/editor.jade', 'editor.html'],
        ['views/old-redirect/index.jade', 'index.html']
    ];
    for (let item of srcOldFilePathList) {
        doCompileAndWrite(item[0], item[1], 'en');
    }

    function doCompileAndWrite(srcRelativePath, destRelativePath, lang) {
        let srcAbsolutePath = path.resolve(projectDir, srcRelativePath);

        const compileCfg = {
            buildVersion: config.buildVersion,
            lang: lang,
            host: config.host,
            blogPath: config.blogPath,
            mainSiteHost: config.mainSiteHost,
            mainSiteCDNPayVersion: config.mainSiteCDNPayVersion,
            cdnPayVersion: config.cdnPayVersion,
            envType: config.envType,
            cdnThirdParty: config.cdnThirdParty
        };

        let destPath = path.resolve(config.releaseDestDir, destRelativePath);
        process.stdout.write(`generating: ${destPath} ...`);

        try {
            let compiledFunction = jade.compileFile(srcAbsolutePath);
            if (config.mainSiteCDNPayRootMap) {
                compileCfg.mainSiteCDNPayRoot = config.mainSiteCDNPayRootMap[lang];
            }
            if (config.cdnPayRootMap) {
                compileCfg.cdnPayRoot = config.cdnPayRootMap[lang];
            }

            const html = compiledFunction(compileCfg);

            fse.ensureDirSync(path.dirname(destPath));
            fs.writeFileSync(destPath, html, 'utf8');

            console.log(chalk.green(` Done.`));
        }
        catch (err) {
            console.error(err);
        }
    }

    console.log('buildHTML done.');
}

async function buildJS(config) {
    const srcBaseDir = path.resolve(projectDir, 'public/javascripts');
    const filePaths = await globby([
        '*.js'
    ], {
        cwd: srcBaseDir
    });

    for (filePath of filePaths) {
        let srcPath = path.resolve(srcBaseDir, filePath);
        let content = fs.readFileSync(srcPath, 'utf8');

        let result = uglify.minify(content);
        if (result.error) {
            console.log(chalk.red(srcPath));
            console.error(result.error);
            process.exit(1);
        }

        let destDir = path.resolve(config.releaseDestDir, 'javascripts');
        fse.ensureDirSync(destDir);
        let destPath = path.resolve(destDir, filePath);
        fs.writeFileSync(destPath, result.code, 'utf8');

        console.log(chalk.green(`generated: ${destPath}`));
    }
}

// async function clean(config) {
//     const filePaths = await globby([
//         'public/**/*.html',
//         '!public/screenshot.html',
//         'release'
//     ], {
//         cwd: projectDir
//     });

//     for (let filePath of filePaths) {
//         let destPath = path.resolve(projectDir, filePath);
//         fs.unlinkSync(destPath);
//         console.log(chalk.strikethrough(`deleted: ${destPath}`));
//     }

//     console.log('clean done.');
// }


async function run() {
    let config = initEnv();
    config.buildVersion = +new Date();
    // Temp: give a fixed version until need to update.
    config.cdnPayVersion = '20200710_1';
    config.mainSiteCDNPayVersion = '20200710_1';

    // await clean(config);

    await copyResourcesToDest(config);

    await buildCSS(config);

    await buildHTML(config);

    await buildJS(config);

    console.log('All done.');
}

run();
