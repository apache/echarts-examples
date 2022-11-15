const globby = require('globby');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const exampleDir = path.join(__dirname, '../public/examples');

async function run() {
  const hasError =
    shell.exec(`tsc --project ${path.join(exampleDir, 'tsconfig.json')}`)
      .code !== 0;
  shell.exec(`prettier --write ${path.join(exampleDir, 'js')}`);

  const files = await globby('js/**/*.js', {
    cwd: exampleDir,
    absolute: true
  });

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
