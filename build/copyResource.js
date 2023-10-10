const fse = require('fs-extra');
const globby = require('globby');
const chalk = require('chalk');
const path = require('node:path');
const assert = require('node:assert');

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
  let isDev =
    argv.dev != null ||
    argv.debug != null ||
    envType === 'debug' ||
    envType === 'dev';

  if (isDev) {
    console.warn(
      '===================================================================='
    );
    console.warn('THIS IS IN DEV MODE');
    console.warn(
      '!!! Please input your local host in `config/env.dev.js` firstly !!!'
    );
    console.warn(
      '===================================================================='
    );
    envType = 'dev';
  }

  if (!envType) {
    throw new Error('--env MUST be specified');
  }

  let config = require('../config/env.' + envType);

  if (isDev) {
    console.warn(
      '===================================================================='
    );
    console.warn('Please visit the website: ');
    console.warn(config.host);
    console.warn(
      '===================================================================='
    );
  }

  assert(path.isAbsolute(config.releaseDestDir));

  config.envType = envType;

  return config;
}

async function copyResourcesToDest(config) {
  const basePath = path.resolve(projectDir, '../public');
  const filePaths = await globby(
    [
      '**/*',
      // Use jade in echarts-www
      '!zh/*',
      '!en/*'
    ],
    {
      cwd: basePath
    }
  );

  console.log();

  for (const filePath of filePaths) {
    fse.ensureDirSync(
      path.resolve(config.releaseDestDir, path.dirname(filePath))
    );
    const destPath = path.resolve(config.releaseDestDir, filePath);
    fse.copyFileSync(path.resolve(basePath, filePath), destPath);

    if (process.stdout.clearLine) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(chalk.green(`resource copied to: ${destPath}`));
    } else {
      console.log(chalk.green(`resource copied to: ${destPath}`));
    }
  }

  console.log('\ncopyResourcesToDest done.');
}

async function run() {
  const config = initEnv();
  await copyResourcesToDest(config);

  console.log('All done.');
}

run();
