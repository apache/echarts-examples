const {
    buildMinimalImportCode,
    buildLegacyMinimalImportCode
} = require('./optionDeps');

module.exports.buildExampleCode = function (
    jsCode, deps, {
        // If enable minimal import
        minimal,
        // If is ESM module or CommonJS module
        // Force to be true in ts mode or minimal mode.
        esm,
        // If use legacy minimal import, like:
        // import 'echarts/lib/chart/bar';
        // Only available when minimal is true.
        legacy,
        // If is ts code
        ts,
        ROOT_PATH
    }
) {
    if (minimal && !legacy) {
        esm = true;
    }
    if (ts) {
        esm = true;
    }

    const hasECStat = jsCode.indexOf('ecStat') >= 0;
    const usedRootPath = jsCode.indexOf('ROOT_PATH') >= 0;
    const usedApp = jsCode.indexOf('app') >= 0;

    const DEP_CODE = `
${hasECStat ?
    esm ? `import ecStat from 'echarts-stat';`
        : `const ecStat = require('echarts-stat');`
    : ''
}
`;
    const IMPORT_CODE = !minimal
        ? esm
            ? `import * as echarts from 'echarts';`
            : `const echarts = require('echarts');`
        : legacy
            ? buildLegacyMinimalImportCode(deps, esm)
            : buildMinimalImportCode(deps, ts);

    const ENV_CODE = [
        usedRootPath ? `const ROOT_PATH = '${ROOT_PATH}'` : '',
        usedApp ? `const app${ts ? ': any' : ''} = {};` : '',
        ts && !minimal ? 'type ECOption = echarts.EChartsOption' : ''
    ].filter(a => !!a).join('\n');

    return `
${IMPORT_CODE}
${DEP_CODE}
${ENV_CODE}

const myChart = echarts.init(document.getElementById('main'));
var option${ts ? ': ECOption' : ''};

${jsCode}

option && myChart.setOption(option);
`;
}