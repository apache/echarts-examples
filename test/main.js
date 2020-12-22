const fs = require('fs');
const globby = require('globby');
const {collectDeps, buildPartialImportCode, buildLegacyPartialImportCode} = require('../common/optionDeps');
const nodePath = require('path');
const { runTasks } = require('../common/task');
const fse = require('fs-extra');
const prettier = require('prettier');

const RUN_CODE_DIR = __dirname + '/tmp/tests';

async function buildRunCode() {
    const root =  `${__dirname}/../public/`;
    const files = await globby(`${root}/data/option/*.json`);

    console.log('Generating codes');
    fse.ensureDirSync(RUN_CODE_DIR);
    const testsList = await runTasks(files, async (fileName) => {
        const optionCode = await fse.readFile(fileName, 'utf-8');
        const option = JSON.parse(optionCode);

        const deps = collectDeps(option).concat([
            // TODO SVG
            'CanvasRenderer'
        ]);

        const commonCode = `
const myChart = echarts.init(document.getElementById('main'));
option = ${optionCode}
myChart.setOption(option);
        `
        const legacyCode = `
${buildLegacyPartialImportCode(deps, true)}
let option;
${commonCode}
        `;
        const tsCode = `
${buildPartialImportCode(deps, true)}
let option: ECOption;
${commonCode}
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
        console.log('Generated: ', nodePath.join(RUN_CODE_DIR, testName + '.ts'));
        return tsFile;
    }, 20);

    return testsList;
}

async function main() {
    await buildRunCode();
}

main().catch(e => {
    console.error(e);
})