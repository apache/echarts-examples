const COMPONENTS_MAP = {
    grid: 'GridComponent',
    polar: 'PolarComponent',
    geo: 'GeoComponent',
    singleAxis: 'SingleAxisComponent',
    parallel: 'ParallelComponent',
    calendar: 'CalendarComponent',
    graphic: 'GraphicComponent',
    toolbox: 'ToolboxComponent',
    tooltip: 'TooltipComponent',
    axisPointer: 'AxisPointerComponent',
    brush: 'BrushComponent',
    title: 'TitleComponent',
    timeline: 'TimelineComponent',
    markPoint: 'MarkPointComponent',
    markLine: 'MarkLineComponent',
    markArea: 'MarkAreaComponent',
    legend: 'LegendComponent',
    dataZoom: 'DataZoomComponent',
    visualMap: 'VisualMapComponent',
    aria: 'AriaComponent',
    dataset: 'DatasetComponent',

    // Dependencies
    xAxis: 'GridComponent',
    yAxis: 'GridComponent',
    angleAxis: 'PolarComponent',
    radiusAxis: 'PolarComponent'
}
const CHARTS_MAP = {
    line: 'LineChart',
    bar: 'BarChart',
    pie: 'PieChart',
    scatter: 'ScatterChart',
    radar: 'RadarChart',
    map: 'MapChart',
    tree: 'TreeChart',
    treemap: 'TreemapChart',
    graph: 'GraphChart',
    gauge: 'GaugeChart',
    funnel: 'FunnelChart',
    parallel: 'ParallelChart',
    sankey: 'SankeyChart',
    boxplot: 'BoxplotChart',
    candlestick: 'CandlestickChart',
    effectScatter: 'EffectScatterChart',
    lines: 'LinesChart',
    heatmap: 'HeatmapChart',
    pictorialBar: 'PictorialBarChart',
    themeRiver: 'ThemeRiverChart',
    sunburst: 'SunburstChart',
    custom: 'CustomChart'
}

const COMPONENTS_MAP_REVERSE = {};
const CHARTS_MAP_REVERSE = {};
const RENDERERS_MAP_REVERSE = {
    'SVGRenderer': 'svg',
    'CanvasRenderer': 'canvas'
}


// Component that will be injected automatically in preprocessor
// These should be excluded util find they were used explicitly.
const MARKERS = ['markLine', 'markArea', 'markPoint'];
const INJECTED_COMPONENTS = [...MARKERS, 'grid'];

// Component that was dependent.
const DEPENDENT_COMPONENTS = [
    'xAxis', 'yAxis', 'angleAxis', 'radiusAxis'
];

Object.keys(COMPONENTS_MAP).forEach(key => {
    // Exclude dependencies.
    if (DEPENDENT_COMPONENTS.includes(key)) {
        return;
    }
    COMPONENTS_MAP_REVERSE[COMPONENTS_MAP[key]] = key;
});
Object.keys(CHARTS_MAP).forEach(key => {
    // Exclude dependencies.
    if (DEPENDENT_COMPONENTS.includes(key)) {
        return;
    }
    CHARTS_MAP_REVERSE[CHARTS_MAP[key]] = key;
});

module.exports.collectDeps = function collectDeps(option) {
    let deps = [];
    if (option.options) {
        option.options.forEach((opt) => {
            deps = deps.concat(collectDeps(opt));
        });

        if (option.baseOption) {
            deps = deps.concat(collectDeps(option.baseOption))
        }

        // Remove duplicates
        return Array.from(new Set(deps));
    }

    Object.keys(option).forEach((key) => {
        if (INJECTED_COMPONENTS.includes(key)) {
            return;
        }

        if (COMPONENTS_MAP[key]) {
            deps.push(COMPONENTS_MAP[key]);
        }
    });

    let series = option.series;
    if (!Array.isArray(series)) {
        series = [series];
    }

    series.forEach((seriesOpt) => {
        if (CHARTS_MAP[seriesOpt.type]) {
            deps.push(CHARTS_MAP[seriesOpt.type]);
        }
        MARKERS.forEach(markerType => {
            if (seriesOpt[markerType]) {
                deps.push(COMPONENTS_MAP[markerType]);
            }
        });
    });

    // Remove duplicates
    return Array.from(new Set(deps));
}

module.exports.buildMinimalImportCode = function (deps, includeType) {
    const componentsImports = [];
    const chartsImports = [];
    const renderersImports = [];
    deps.forEach(function (dep) {
        if (dep.endsWith('Renderer')) {
            renderersImports.push(dep);
        }
        else if (dep.endsWith('Chart')) {
            chartsImports.push(dep);
            if (includeType) {
                chartsImports.push(dep.replace(/Chart$/, 'SeriesOption'));
            }
        }
        else if (dep.endsWith('Component')) {
            componentsImports.push(dep);
            if (includeType) {
                componentsImports.push(dep.replace(/Component$/, 'ComponentOption'));
            }
        }
    });

    function getImportsPartCode(imports) {
        return `${imports.map(str => `
    ${str}`).join(',')}`;
    }

    const allImports = [
        ...componentsImports,
        ...chartsImports,
        ...renderersImports
    ];

    const ECOptionTypeCode = `
type ECOption = echarts.ComposeOption<
    ${allImports.filter(a => a.endsWith('Option')).join(' | ')}
>
    `;

    return `
import * as echarts from 'echarts/core';

import {${getImportsPartCode(componentsImports)}
} from 'echarts/components';

import {${getImportsPartCode(chartsImports)}
} from 'echarts/charts';

import {${getImportsPartCode(renderersImports)}
} from 'echarts/renderers';

echarts.use(
    [${allImports.filter(a => !a.endsWith('Option')).join(', ')}]
);
` + (includeType ? ECOptionTypeCode : '')
}

module.exports.buildLegacyMinimalImportCode = function (deps, isESM) {
    const rootFolder = isESM ? 'esm' : 'lib';
    const modules = [];
    deps.forEach(function (dep) {
        if (dep.endsWith('Renderer')) {
            modules.push(`zrender/${rootFolder}/${RENDERERS_MAP_REVERSE[dep]}/${RENDERERS_MAP_REVERSE[dep]}`);
        }
        else if (dep.endsWith('Chart')) {
            modules.push(`echarts/${rootFolder}/chart/${CHARTS_MAP_REVERSE[dep]}`);
        }
        else if (dep.endsWith('Component')) {
            modules.push(`echarts/${rootFolder}/component/${COMPONENTS_MAP_REVERSE[dep]}`);
        }
    });

    return isESM ? `
import * as echarts from 'echarts/index.blank';
${modules.map(mod => {
    return `import '${mod}';`;
}).join('\n')}
` : `
const echarts = require('echarts/lib/echarts.blank');
${modules.map(mod => {
    return `require('${mod}');`;
}).join('\n')}
`
}