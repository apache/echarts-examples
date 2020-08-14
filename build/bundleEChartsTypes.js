const globby = require('globby');
const path = require('path');
const fs = require('fs');

const defaultECDir = '../echarts-next';
const defaultZRDir = '../zrender-next';

const echartsDir = path.resolve(__dirname, '..', defaultECDir);
const zrenderDir = path.resolve(__dirname, '..', defaultZRDir);
const outFile = path.resolve(__dirname, '../public/types/echarts-type-bundle.json');

async function bundle() {
    const files = await globby([
        zrenderDir + '/esm/**/*.d.ts',
        zrenderDir + '/index.d.ts',
        echartsDir + '/types/**/*.d.ts',
        echartsDir + '/index.d.ts'
    ]);
    const dtsBundle = [];
    for (let file of files) {
        const relPath = file.indexOf(echartsDir) >= 0
            ? 'echarts/' + path.relative(echartsDir, file)
            : 'zrender/' + path.relative(zrenderDir, file);
        dtsBundle.push({
            path: relPath,
            code: fs.readFileSync(file, 'utf-8')
        });
    }

    fs.writeFileSync(outFile, JSON.stringify(dtsBundle, null, 2), 'utf-8');
}

bundle();