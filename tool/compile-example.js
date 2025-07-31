const globby = require('globby');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

/**
 * @usage
 *  ```shell
 *  # compile all
 *  npm run compile:example
 *
 *  # compile single
 *  npm run compile:example -- area-basic.ts
 *  ```
 */

const exampleDir = path.join(__dirname, '../public/examples');

// Get the file argument (relative to exampleDir, e.g. 'area-basic.ts')
const fileArg = process.argv[2];

async function run() {
  const tsConfigPath = path.join(exampleDir, 'tsconfig.json');

  let singleSrcFilePath;
  let intermediaJSFilePath;
  let retCode;

  if (fileArg) {
    singleSrcFilePath = path.join(exampleDir, 'ts', fileArg);
    console.log(`Compile single file "${singleSrcFilePath}" ...`);
    intermediaJSFilePath = singleSrcFilePath
      .replace(/\.ts$/, '.js')
      .replace(/\/ts\//, '/js/');

    if (!fs.existsSync(singleSrcFilePath)) {
      console.error(`${singleSrcFilePath} does not exist.`);
      process.exit(1);
    }
    // Create a temporary tsconfig.single.json
    const tempConfigPath = path.join(exampleDir, 'tsconfig.single.json');
    const tempConfig = {
      extends: './tsconfig.json',
      include: [
        path.join('ts', fileArg), // relative to exampleDir
        './types/**/*.d.ts'
      ]
    };
    fs.writeFileSync(
      tempConfigPath,
      JSON.stringify(tempConfig, null, 2),
      'utf-8'
    );

    // Compile using the temp config
    retCode = shell.exec(`tsc --project "${tempConfigPath}"`).code;

    // Remove the temp config
    fs.unlinkSync(tempConfigPath);
  } else {
    retCode = shell.exec(`tsc --project "${tsConfigPath}"`).code;
  }

  console.log(`tsc return code: ${retCode}`);

  // There might be TS error, but probably no need to handle them immediately,
  // thus do not block the subsequent process.
  // if (retCode !== 0) {
  //   process.exit(retCode);
  // }

  // Prettier for the corresponding JS file
  if (fileArg) {
    if (fs.existsSync(intermediaJSFilePath)) {
      shell.exec(`prettier --write "${intermediaJSFilePath}"`);
    } else {
      console.error(`prettier JS file not found: ${intermediaJSFilePath}`);
      process.exit(1);
    }
  } else {
    shell.exec(`prettier --write "${path.join(exampleDir, 'js')}"`);
  }

  let files;
  if (fileArg) {
    files = [intermediaJSFilePath];
  } else {
    files = await globby('js/**/*.js', {
      cwd: exampleDir,
      absolute: true
    });
  }

  for (const file of files) {
    const content =
      fs
        .readFileSync(file, 'utf-8')
        .trim()
        // ts code needs add `export {}` to be a module. remove it.
        // FIXME
        .replace(/export\s+\{\s*\}\s*;?$/g, '')
        .replace(/^'use strict';/, '')
        .trim() + '\n';

    fs.writeFileSync(file, content, 'utf-8');
  }

  // if (hasError) {
  //   shell.exit(1);
  // }
}

run();
