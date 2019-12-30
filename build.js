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

const argv = require('yargs').argv;
const projectDir = __dirname;

/**
 * ------------------------------------------------------------------------
 * Usage:
 *
 * ```shell
 * node build.js --env asf
 * node build.js --env echartsjs
 * node build.js --env dev # the same as "debug"
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

    for (let lang of langs) {
        let patternNames = ['view.jade', 'editor.jade', 'index.jade'];

        for (let patternName of patternNames) {
            let filePath = path.resolve(projectDir, 'views', patternName);
            let compiledFunction = jade.compileFile(filePath);

            let html = compiledFunction({
                buildVersion: config.buildVersion,
                lang: lang,
                host: config.host,
                blogPath: config.blogPath,
                mainSitePath: config.mainSitePath
            });

            let destDir = path.resolve(config.releaseDestDir, lang);
            fse.ensureDirSync(destDir);
            let destPath = path.resolve(destDir, patternName.replace('.jade', '.html'));
            fs.writeFileSync(destPath, html, 'utf8');

            console.log(chalk.green(`generated: ${destPath}`));
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
        let code = uglify.minify(content).code;
        let destDir = path.resolve(config.releaseDestDir, 'javascripts');
        fse.ensureDirSync(destDir);
        let destPath = path.resolve(destDir, filePath);
        fs.writeFileSync(destPath, code, 'utf8');

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

    // await clean(config);

    await copyResourcesToDest(config);

    await buildCSS(config);

    await buildHTML(config);

    await buildJS(config);

    console.log('All done.');
}

run();
